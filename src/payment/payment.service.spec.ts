import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should make a payment', async () => {

    // TODO: should make a payment between two accounts using ethers module
  
  });
});
