import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  from: number;

  @IsNotEmpty()
  @IsNumber()
  to: number;
  
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
