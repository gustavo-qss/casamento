import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';

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

  // Lista todas as confirmações (mais recentes primeiro), em camelCase.
  async findAll() {
    const { data, error } = await this.supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Erro ao listar RSVP: ${error.message}`);
      throw new InternalServerErrorException('Não foi possível listar as confirmações.');
    }

    return (data ?? []).map((row) => this.toCamel(row));
  }

  // Atualiza campos corrigidos pelo painel. Mapeia camelCase -> colunas snake_case.
  async update(id: string, dto: UpdateRsvpDto) {
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.phone !== undefined) patch.phone = dto.phone;
    if (dto.guestsCount != null) patch.guests_count = dto.guestsCount;
    if (dto.childrenUnder4 !== undefined) patch.children_under_4 = dto.childrenUnder4 ?? 0;
    if (dto.childrenUnder10 !== undefined) patch.children_under_10 = dto.childrenUnder10 ?? 0;
    if (dto.childrenAge11 !== undefined) patch.children_age_11 = dto.childrenAge11 ?? 0;
    if (dto.dietary !== undefined) patch.dietary = dto.dietary || null;
    if (dto.comprovanteUrl !== undefined) patch.comprovante_url = dto.comprovanteUrl || null;

    const { data, error } = await this.supabase
      .from('rsvp')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') {
        throw new NotFoundException('Confirmação não encontrada.');
      }
      this.logger.error(`Erro ao atualizar RSVP ${id}: ${error?.message ?? 'sem dados'}`);
      throw new InternalServerErrorException('Não foi possível salvar a alteração.');
    }

    this.logger.log(`RSVP atualizado — id: ${id}`);
    return this.toCamel(data);
  }

  private toCamel(row: Record<string, any>) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      guestsCount: row.guests_count,
      childrenUnder4: row.children_under_4,
      childrenUnder10: row.children_under_10,
      childrenAge11: row.children_age_11,
      dietary: row.dietary,
      comprovanteUrl: row.comprovante_url,
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
    };
  }
}
