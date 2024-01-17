import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// Import AccountModule
import { AccountModule } from '../account/account.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    forwardRef(() => AccountModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService] // added TypeOrmModule
})
export class UserModule {}
