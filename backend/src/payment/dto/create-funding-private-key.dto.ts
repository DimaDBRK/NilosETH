import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateFundingDto {
  // Private key of the Ganache account
  @IsNotEmpty()
  @IsString()
  fromPrivateKey: string; 

  // ID of the account in table
  @IsNotEmpty()
  @IsNumber()
  toAccountId: number; 

  // Amount to be transferred
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number; 
}