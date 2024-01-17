import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
//  import the UserModule to make UserRepository available
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  // add User module import
  // Use forwardRef()
  imports: [
    TypeOrmModule.forFeature([Account]),  
    forwardRef(() => UserModule), 
  ], 
  providers: [AccountService],
  controllers: [AccountController],
  exports: [TypeOrmModule, AccountService] // added TypeOrmModule for export to payment 
})
export class AccountModule {}
