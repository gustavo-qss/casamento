import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Todos os campos opcionais — o painel edita só o que precisa corrigir.
export class UpdateRsvpDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  guestsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  childrenUnder4?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  childrenUnder10?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  childrenAge11?: number;

  @IsOptional()
  @IsString()
  dietary?: string;

  @IsOptional()
  @IsString()
  comprovanteUrl?: string;
}
