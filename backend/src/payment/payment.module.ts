import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
//  import the AccountModule to make AccountRepo available
import { AccountModule } from '../account/account.module'; // Import UserModule

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), AccountModule], // add User module import
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule {}
