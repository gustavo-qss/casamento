import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';

@Injectable()
export class LettersService {
  private readonly logger = new Logger(LettersService.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  async create(dto: CreateLetterDto): Promise<{ id: string }> {
    const { data, error } = await this.supabase
      .from('letters')
      .insert({
        guest_name: dto.guestName,
        message: dto.message ?? '',
        items: dto.items ?? null,
        total: dto.total ?? null,
      })
      .select('id')
      .single();

    if (error) {
      this.logger.error(`Erro ao salvar carta: ${error.message}`);
      throw new InternalServerErrorException('Não foi possível salvar a mensagem.');
    }

    this.logger.log(`Carta salva — id: ${data.id} | convidado: ${dto.guestName}`);
    return { id: data.id as string };
  }

  // Lista todas as mensagens (mais recentes primeiro), em camelCase.
  async findAll() {
    const { data, error } = await this.supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Erro ao listar cartas: ${error.message}`);
      throw new InternalServerErrorException('Não foi possível listar as mensagens.');
    }

    return (data ?? []).map((row) => this.toCamel(row));
  }

  async update(id: string, dto: UpdateLetterDto) {
    const patch: Record<string, unknown> = {};
    if (dto.guestName !== undefined) patch.guest_name = dto.guestName;
    if (dto.message !== undefined) patch.message = dto.message ?? '';

    const { data, error } = await this.supabase
      .from('letters')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') {
        throw new NotFoundException('Mensagem não encontrada.');
      }
      this.logger.error(`Erro ao atualizar carta ${id}: ${error?.message ?? 'sem dados'}`);
      throw new InternalServerErrorException('Não foi possível salvar a alteração.');
    }

    this.logger.log(`Carta atualizada — id: ${id}`);
    return this.toCamel(data);
  }

  private toCamel(row: Record<string, any>) {
    return {
      id: row.id,
      guestName: row.guest_name,
      message: row.message,
      items: row.items,
      total: row.total,
      createdAt: row.created_at,
    };
  }
}
