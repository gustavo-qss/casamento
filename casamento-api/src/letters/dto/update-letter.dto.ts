import { IsString, IsOptional } from 'class-validator';

// Campos editáveis de uma carta pelo painel /adm.
export class UpdateLetterDto {
  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
