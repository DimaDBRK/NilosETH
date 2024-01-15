import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an Ethereum account', async () => {

    // TODO: Create a new account using ethers module
    
  });
});
