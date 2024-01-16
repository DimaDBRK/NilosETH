import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CheckBalancesDto {
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  accountIds: number[];
}