import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

// Token de admin válido por 12h.
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

/**
 * Autenticação do painel /adm.
 * As credenciais ficam na tabela `admin` do Supabase (username + password_hash
 * no formato pbkdf2$<iter>$<saltHex>$<hashHex>). No login bem-sucedido devolve
 * um token compacto assinado com HMAC-SHA256 — verificado depois pelo AdminGuard.
 * Usa apenas o módulo `crypto` nativo do Node (sem dependências externas).
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly supabase: SupabaseClient;
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );

    const configured = config.get<string>('ADMIN_TOKEN_SECRET');
    if (configured) {
      this.secret = configured;
    } else {
      // Sem segredo fixo os tokens invalidam a cada restart — funciona, mas
      // o ideal é definir ADMIN_TOKEN_SECRET no ambiente (Render).
      this.secret = randomBytes(32).toString('hex');
      this.logger.warn(
        'ADMIN_TOKEN_SECRET não definido — usando segredo efêmero (logins caem a cada restart).',
      );
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; username: string }> {
    const { data, error } = await this.supabase
      .from('admin')
      .select('username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      this.logger.error(`Erro ao buscar admin: ${error.message}`);
      throw new UnauthorizedException('Login ou senha incorretos.');
    }

    if (!data || !this.verifyPassword(password, data.password_hash as string)) {
      throw new UnauthorizedException('Login ou senha incorretos.');
    }

    this.logger.log(`Login admin: ${username}`);
    return { token: this.issueToken(username), username };
  }

  /** Verifica a senha contra o hash pbkdf2 armazenado (comparação constante). */
  private verifyPassword(password: string, stored: string): boolean {
    try {
      const [scheme, iterStr, saltHex, hashHex] = (stored || '').split('$');
      if (scheme !== 'pbkdf2') return false;
      const iterations = parseInt(iterStr, 10);
      const salt = Buffer.from(saltHex, 'hex');
      const expected = Buffer.from(hashHex, 'hex');
      const actual = pbkdf2Sync(
        password,
        salt,
        iterations,
        expected.length,
        'sha256',
      );
      return expected.length === actual.length && timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }

  private issueToken(username: string): string {
    const payload = Buffer.from(
      JSON.stringify({ sub: username, exp: Date.now() + TOKEN_TTL_MS }),
    ).toString('base64url');
    const sig = createHmac('sha256', this.secret)
      .update(payload)
      .digest('base64url');
    return `${payload}.${sig}`;
  }

  /** Valida assinatura + expiração de um token emitido por issueToken(). */
  verifyToken(token: string): boolean {
    if (!token) return false;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;

    const expected = createHmac('sha256', this.secret)
      .update(payload)
      .digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

    try {
      const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
        exp?: number;
      };
      return typeof data.exp === 'number' && data.exp > Date.now();
    } catch {
      return false;
    }
  }
}
