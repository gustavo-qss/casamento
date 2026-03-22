import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateLetterDto } from './dto/create-letter.dto';

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
}
