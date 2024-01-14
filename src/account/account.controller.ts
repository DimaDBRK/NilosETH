import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  getAccounts(): Promise<Account[]> {
    return this.accountService.findAll();
  }
  
  @Get(':id')
  getAccountById(@Param('id') id: number): Promise<Account> {
    return this.accountService.findOne(id);
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }
}
