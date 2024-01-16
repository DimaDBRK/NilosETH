import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
//  import the UserModule to make UserRepository available
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [TypeOrmModule.forFeature([Account]),  UserModule], // add User module import
  providers: [AccountService],
  controllers: [AccountController],
  exports: [TypeOrmModule, AccountService] // added TypeOrmModule for export to payment 
})
export class AccountModule {}
