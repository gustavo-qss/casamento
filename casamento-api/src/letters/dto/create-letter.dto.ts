import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';

export class CreateLetterDto {
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsArray()
  @IsOptional()
  items?: Record<string, unknown>[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;
}
