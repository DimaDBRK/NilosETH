import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';

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
}
