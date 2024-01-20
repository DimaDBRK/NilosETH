import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
// Import AccountResponseDto
import { AccountResponseDto } from './dto/response-account.dto'; 



@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  getAccounts(): Promise<AccountResponseDto[]> {
    return this.accountService.findAll();
  }
  
  @Get(':id')
  // Update return type
  getAccountById(@Param('id') id: number):  Promise<AccountResponseDto> {
    return this.accountService.findOne(id);
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }
}
