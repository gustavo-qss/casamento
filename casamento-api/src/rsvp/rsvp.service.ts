import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@Injectable()
export class RsvpService {
  private readonly logger = new Logger(RsvpService.name);
  private readonly supabase: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.supabase = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  async create(dto: CreateRsvpDto): Promise<{ id: string }> {
    const paymentStatus = dto.comprovanteUrl ? 'pending_review' : 'pending';

    const { data, error } = await this.supabase
      .from('rsvp')
      .insert({
        name: dto.name,
        phone: dto.phone,
        guests_count: dto.guestsCount,
        children_under_4:  dto.childrenUnder4  ?? 0,
        children_under_10: dto.childrenUnder10 ?? 0,
        children_age_11:   dto.childrenAge11   ?? 0,
        dietary: dto.dietary ?? null,
        comprovante_url: dto.comprovanteUrl ?? null,
        payment_status: paymentStatus,
      })
      .select('id')
      .single();

    if (error) {
      this.logger.error(`Erro ao salvar RSVP: ${error.message}`);
      throw new InternalServerErrorException('Não foi possível registrar a confirmação.');
    }

    this.logger.log(
      `RSVP salvo — id: ${data.id} | convidado: ${dto.name} | pessoas: ${dto.guestsCount} | status: ${paymentStatus}`,
    );
    return { id: data.id as string };
  }
}
