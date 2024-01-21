import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { PaymentService } from './payment.service';
// imports
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Account } from '../account/account.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  // add repos
  let paymentRepository: Repository<Payment>;
  let accountRepository: Repository<Account>;
  let provider: ethers.JsonRpcProvider;

  // Test accounts
  let testFromAccount: Account;
  let testToAccount: Account;
  let ganacheAccount: { address: string, privateKey: string };

  beforeAll(async () => {
    // Connect to the Ganache local blockchain
    provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL || 'http://localhost:7545');

    ganacheAccount = {
      address: process.env.GANACHE_ACCOUNT_ADDRESS, // Replace with your Ganache account address
      privateKey: process.env.GANACHE_ACCOUNT_PRIVATE_KEY // Replace with your Ganache account private key
    };

    // Create a testing module with PaymentService and its dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        // Provide a mock repository for Account entities => replace the actual TypeORM repository with a mock
        // function is used to generate a dependency injection token for the repository => the Account entity. 
        // This token is used by NestJS's dependency injection system to identify and inject the correct provider.
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        // Provide a mock repository for Account entities
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
      
      ],
    }).compile();
    // Retrieve the instantiated services and repositories from the module
    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(getRepositoryToken(Payment));
    accountRepository = module.get(getRepositoryToken(Account));
  
    // Inject the Ethereum provider into the service
    service.provider = provider;

    // Create 'from' and 'to' accounts for testing
    const fromWallet = ethers.Wallet.createRandom();
    const toWallet = ethers.Wallet.createRandom();

    testFromAccount = {
      id: 1,
      publicKey: fromWallet.address,
      privateKey: fromWallet.privateKey,
      user: null,
    };

    testToAccount = {
      id: 2,
      publicKey: toWallet.address,
      privateKey: toWallet.privateKey,
      user: null,
    };
    // Mock the paymentRepository's save method
    jest.spyOn(paymentRepository, 'save').mockImplementation((payment: Payment) => Promise.resolve(payment));

    jest.spyOn(accountRepository, 'findOne').mockImplementation((options: any) => {
      const id = typeof options === 'object' ? options.where.id : options;
      if (id === testFromAccount.id) return Promise.resolve(testFromAccount);
      if (id === testToAccount.id) return Promise.resolve(testToAccount);
      return Promise.resolve(null);
  });

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to the Ganache (Ethereum test network)', async () => {
    const blockNumber = await provider.getBlockNumber();
    expect(blockNumber).toBeGreaterThanOrEqual(0);
  });

  it('should fund the "from" account from a specified Ganache account', async () => {
    // Initialize the Ganache wallet with the private key and provider
    const ganacheWallet = new ethers.Wallet(ganacheAccount.privateKey, provider);

    // Get the balance of the Ganache account before funding
    const balanceBefore = await provider.getBalance(ganacheWallet.address);
    const balanceBeforeBI = BigInt(balanceBefore);
    
    // Specify the amount to fund
    const amount = 0.2
    const amountToFund = ethers.parseEther(amount.toString()); 
    const amountToFundBI = BigInt(amountToFund);

    // Ensure the Ganache account has at least amount to transfer balance
    if (balanceBeforeBI < amountToFundBI) {
      throw new Error("The Ganache account doesn't have enough ETH. Please fund the account or change to new on in .env.test.");
    }

    // Send transaction to fund the 'from' account from the Ganache account
    const tx = {
      to: testFromAccount.publicKey, // Address of the 'from' account to be funded
      value: amountToFund, // Amount to fund
    };
    const transaction = await ganacheWallet.sendTransaction(tx);
    // Wait for the transaction to be mined
    await transaction.wait();

    // Get the balance of the 'from' account after the funding transaction
    const balanceAfter = await provider.getBalance(testFromAccount.publicKey);

    // Check if the 'from' account's balance after the transaction is equal to the amount it was funded with
    expect(balanceAfter).toEqual(amountToFund);
  });

  it('should create "from" and "to" accounts before tests', async () => {
   //  just verify that accounts was created in hook
    expect(testFromAccount).toBeDefined();
    expect(testToAccount).toBeDefined();
  });

  it('should make a payment', async () => {
    const amountToPayNum = 0.1;
    // Payment amount in ETH
    const amountToPay = ethers.parseEther(amountToPayNum.toString()); 
    // Gas price for the transaction
    const gasPrice = ethers.parseUnits('10', 'gwei'); 

    // Get balance => 'from' and 'to' accounts
    const initialFromBalance = await provider.getBalance(testFromAccount.publicKey);
    const initialToBalance = await provider.getBalance(testToAccount.publicKey);

    // Convert => BigInt 
    const initialFromBalanceBI = BigInt(initialFromBalance);
    const amountToPayBI = BigInt(amountToPay);
    const gasPriceBI = BigInt(gasPrice);

    // Check  'from' account has enough balance for the payment and gas fee
    // Assuming a gas limit of 21000 for a simple transaction
    const gasLimitBI = BigInt(21000);
    const totalCostBI = amountToPayBI + gasPriceBI * gasLimitBI;
    if (initialFromBalanceBI < totalCostBI) {
        throw new Error("The 'from' account doesn't have enough ETH for the payment and gas fee.");
    }

     // Create the payment DTO
    const createPaymentDto: CreatePaymentDto = {
      from: testFromAccount.id,
      to: testToAccount.id,
      amount: amountToPayNum,
    };

    // Perform the payment transaction
    const paymentResponse = await service.create(createPaymentDto);

    // Assert the structure of the payment response
    expect(paymentResponse).toHaveProperty('id');
    expect(paymentResponse).toHaveProperty('from');
    expect(paymentResponse).toHaveProperty('to');
    expect(paymentResponse).toHaveProperty('amount');

    // Get the final balance of the 'from' and 'to' accounts
    const finalFromBalance = await provider.getBalance(testFromAccount.publicKey);
    const finalToBalance = await provider.getBalance(testToAccount.publicKey);



    // Convert to BigInt
    const finalFromBalanceBI = BigInt(finalFromBalance);
    const finalToBalanceBI = BigInt(finalToBalance);

    // Convert the final balances to strings for logging and comparing
    const finalFromBalanceInEth = ethers.formatEther(finalFromBalance);
    const finalToBalanceInEth = ethers.formatEther(finalToBalance);

    console.log(`Final balance of 'from' account (${testFromAccount.publicKey}): ${finalFromBalanceInEth} ETH`);
    console.log(`Final balance of 'to' account (${testToAccount.publicKey}): ${finalToBalanceInEth} ETH`);

    // Convert BigInt values to strings for assertions
    const expectedFinalToBalanceStr = (BigInt(initialToBalance) + amountToPayBI).toString();
    const finalToBalanceStr = finalToBalanceBI.toString();

    // Use the string values for comparison to avoid BigInt serialization issues
    expect(finalToBalanceStr).toEqual(expectedFinalToBalanceStr);
    
  });

 });
