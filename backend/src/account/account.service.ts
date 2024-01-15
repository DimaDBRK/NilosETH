import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

// Change logic create account:
// receive a user Id from request body in the CreateAccountDto, fetch the corresponding User entity from the database, 
// and then use it to create an account
// Import the User entity
import { User } from '../user/user.entity'; 

@Injectable()
export class AccountService {
  // provider added
  private provider: ethers.JsonRpcProvider;
  
  constructor(
   
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
     // Inject the UserRepository to modify logic
    @InjectRepository(User)
    private userRepository: Repository<User>, 
    ) {
    // Connect to Ganache 
    // If no %%url%% is provided, it connects to the default
    // http://localhost:8545, which most nodes use.
    this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    // get User by "user" ID
    const user = await this.userRepository.findOne({ where: { id: createAccountDto.user } });
    if (!user) {
      throw new NotFoundException(`User with ID ${createAccountDto.user} not found`);
    }

    // Wallet info => to the account entity
    const account = new Account();
    
    // TODO: Create a new account using ethers module
    // Create a new wallet (STATIC METHODS, no new keyword)
    const wallet = ethers.Wallet.createRandom();

     // wallet details to the account entity. 
     // Storing private keys in DB- check secure ???
     account.publicKey = wallet.address;
     account.privateKey = wallet.privateKey; 
     account.user = user; // modify from user to createAccountDto.user;

    return this.accountRepository.save(account);
  }

  async findOne(id: number) {
    const user = await this.accountRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll() {
    return this.accountRepository.find();
  }
}
