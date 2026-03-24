import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRsvpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  guestsCount: number;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  @Type(() => Number)
  childrenUnder4?: number;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  @Type(() => Number)
  childrenUnder8?: number;

  @IsString()
  @IsOptional()
  dietary?: string;

  @IsString()
  @IsOptional()
  comprovanteUrl?: string;
}
