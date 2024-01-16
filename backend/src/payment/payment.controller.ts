import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
// import dto for funding account from other accounts
import { CreateFundingDto } from './dto/create-funding-private-key.dto';
// import dto for balance check
import { CheckBalancesDto } from './dto/check-balance.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  @Get()
  getPayments(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }
  
  @Get(':id')
  getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  // create an endpoint that funds an account
  @Post('funding')
  async fundAccount(@Body() createFundingDto: CreateFundingDto) {
    return this.paymentService.fundAccount(createFundingDto);
  }

  // Check Account Balance
  @Post('balance')
  async getAccountsBalances(@Body() checkBalancesDto: CheckBalancesDto): Promise<any> {
    return this.paymentService.getAccountsBalances(checkBalancesDto);
  }
  
}
