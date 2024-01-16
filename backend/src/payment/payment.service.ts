import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
// import dto for funding account from other accounts
import { CreateFundingDto } from './dto/create-funding-private-key.dto';
// Import the Account entity
import { Account } from '../account/account.entity';
// Implement logging for errors
import { Logger } from '@nestjs/common';
// import dto for balance check
import { CheckBalancesDto } from './dto/check-balance.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentService {
  // logger
  private readonly logger = new Logger(PaymentService.name);
  // provider added
  private provider: ethers.JsonRpcProvider;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    // Add Account repository
    @InjectRepository(Account)
    private accountRepository: Repository<Account>, 

  ) {
    // Connect to Ganache 
    // If no %%url%% is provided, it connects to the default
    // http://localhost:8545 for PU and http://localhost:7545 for GUI, which most nodes use.
    this.provider = new ethers.JsonRpcProvider('http://localhost:7545');
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = new Payment();
        

      // TODO: Create a new payment using ethers module
      // This method should handle the Ethereum transaction process between two accounts
      
      // get 'from' and 'to' accounts from the database and check it the exist
      const fromAccount = await this.accountRepository.findOne({ where: { id: createPaymentDto.from } });
      const toAccount = await this.accountRepository.findOne({ where: { id: createPaymentDto.to } });
      
      if (!fromAccount || !toAccount) {
        throw new NotFoundException('Account not found');
      }
      // Check the balance of the 'from' account (has enough balance to send the amount)
     
      const amountToTransfer = ethers.parseEther(createPaymentDto.amount.toString());
      const amountToTransferBN = BigInt(amountToTransfer);
    
      const fromBalance = await this.provider.getBalance(fromAccount.publicKey);
      const fromBalanceBN = BigInt(fromBalance);
     
     
      // check
      if (fromBalanceBN <= amountToTransferBN) {
        throw new BadRequestException('Insufficient balance in the from account');
      }
      // Create a new Ethereum wallet for the 'from' account
      const fromWallet = new ethers.Wallet(fromAccount.privateKey);

      // Connect the wallet to the provider
      const connectedWallet = fromWallet.connect(this.provider);
 
      // Send transaction
      const tx = {
        // to account Ethereum address => public key
        to: toAccount.publicKey, 
        value: ethers.parseEther(createPaymentDto.amount.toString()) // parseEther => converts the decimal string ether to a BigInt, using 18 decimal places.
      };

      const transaction = await connectedWallet.sendTransaction(tx);
      await transaction.wait();

      // Add info to  payment record
      payment.from = fromAccount;
      payment.to = toAccount;
      payment.amount = createPaymentDto.amount;

      return await this.paymentsRepository.save(payment);
        
    } catch (error) {
      this.logger.error(`Error creating payment: ${error.message}`, error.stack);
      throw error; 
    }
  }

  // modification - changed user to payment
  async findOne(id: number) {
    const payment = await this.paymentsRepository.findOne({where: {id}});
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findAll() {
    return this.paymentsRepository.find();
  }

  // function that funds an account using a specific Ganache account
  async fundAccount(createFundingDto: CreateFundingDto): Promise<any> {
    // Fetch the account in your app to be funded
    const appAccount = await this.accountRepository.findOne({ where: { id: createFundingDto.toAccountId } });
    if (!appAccount) {
      throw new NotFoundException(`App account with ID ${createFundingDto.toAccountId} not found`);
    }

    // Use the Ganache account address to send Ether
    // Create a wallet instance for the Ganache account
    const ganacheWallet = new ethers.Wallet(createFundingDto.fromPrivateKey, this.provider);

    // Create and send the transaction => to public key of the app account
    const tx = {
      to: appAccount.publicKey, 
      value: ethers.parseEther(createFundingDto.amount.toString()),
      };
      
      const transaction = await ganacheWallet.sendTransaction(tx);
      await transaction.wait();
      
      return { transactionHash: transaction.hash };
  }

  // check balance by id (arr of ids)
  async getAccountsBalances(checkBalancesDto: CheckBalancesDto): Promise<any> {
    let balances = {};
    for (const accountId of checkBalancesDto.accountIds) {
      const account = await this.accountRepository.findOne( { where: { id:accountId } } );
      if (!account) {
        balances[accountId] = 'Account not found';
      } else {
        const balance = await this.provider.getBalance(account.publicKey);
        balances[accountId] = ethers.formatEther(balance);
      }
    }
    return balances;
  }
}