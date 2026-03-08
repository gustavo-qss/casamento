import { IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CartItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
