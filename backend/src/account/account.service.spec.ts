import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AccountService } from './account.service';
// add imports
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../user/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
// Add the import for NotFoundException
import { NotFoundException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;
  let userRepository: Repository<User>;
  let provider: ethers.JsonRpcProvider;

  // Before => initialize the testing module
  beforeAll(async () => {
    // Connect to the Ganache local blockchain
    provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL || 'http://localhost:7545');

    // Create a testing module with AccountService and its dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
      {
        // Provide a mock repository for Account entities => replace the actual TypeORM repository with a mock
        // function is used to generate a dependency injection token for the repository => the Account entity. 
        // This token is used by NestJS's dependency injection system to identify and inject the correct provider.
        provide: getRepositoryToken(Account),
        useClass: Repository,
      },
      {
        // Provide a mock repository for User entities
        provide: getRepositoryToken(User),
        useClass: Repository,
      },
    ],
    }).compile();
    // Retrieve the instantiated services and repositories from the module
    service =  module.get<AccountService>(AccountService);
    accountRepository = module.get(getRepositoryToken(Account));
    userRepository = module.get(getRepositoryToken(User));

    // Inject the Ethereum provider into the service
    service.provider = provider;
  });

  


  // Basic test to => check if service is ok
  it('should be defined (check Service is OK)', () => {
    expect(service).toBeDefined(); 
  });

  // Test case for checking Ethereum test network connectivity
  it('should connect to the Ganache (Ethereum test network)', async () => {
    // Check if the Ethereum test network is up and running
    const blockNumber = await provider.getBlockNumber();
    // Check if block number is valid
    expect(blockNumber).toBeGreaterThanOrEqual(0);
    // Ensure block number is received
    expect(blockNumber).toBeDefined(); 
    console.log(`Connected to Ganache (Ethereum test network) at block number: ${blockNumber}`);
  });

  // Account Creation Tests
  it('should create an Ethereum account', async () => {

    // TODO: Create a new account using ethers module
    // Mock user with ID 1
    const mockUserId = 1;
    const mockUser = { 
      id: mockUserId, 
      username: 'testUser', 
      password: 'testPass',
      // Add accounts array to match the User entity structure
      accounts: [], 
     };
    const createAccountDto: CreateAccountDto = { user: mockUserId };

    // Mock the userRepository to return a predefined User object
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

    // Spy on the accountRepository's save method to capture its calls
    const saveSpy = jest.spyOn(accountRepository, 'save').mockImplementation(account => Promise.resolve(account as Account));

    // Call the createAccount method with the mocked data
    const accountResponse = await service.createAccount(createAccountDto);

    // Check that the save method was called and the response is correctly structured
    expect(saveSpy).toHaveBeenCalled();
    expect(accountResponse).toHaveProperty('id');
    expect(accountResponse).toHaveProperty('publicKey');
    expect(accountResponse).toHaveProperty('user');
    expect(accountResponse.user.id).toEqual(mockUserId);

     // Fetch the balance of the newly created account
    const balance = await service.provider.getBalance(accountResponse.publicKey);
    const balanceInEther = ethers.formatEther(balance);
    const roundedBalance = Number(balanceInEther).toFixed(2);

    // Check that the balance of the new account is 0 (as it's a new account)
    expect(roundedBalance).toEqual('0.00');
    expect(accountResponse.publicKey).toBeDefined();

  
    console.log(`Created Ethereum account with public key: ${accountResponse.publicKey}`);
    console.log(`Balance of the new account: ${roundedBalance} ETH`);

  });

  it('should throw NotFoundException when creating an account with a non-existent user ID', async () => {
    // Mock user ID that does not exist
    const mockUserId = 99;
    const createAccountDto: CreateAccountDto = { user: mockUserId };

    // Mock the userRepository to return null
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    // Expect the createAccount method to throw a NotFoundException
    await expect(service.createAccount(createAccountDto)).rejects.toThrow(NotFoundException);
  });

  // Account Retrieval Tests
  it('should retrieve an existing account', async () => {
    // Mock account data
    const mockAccountId = 1;
    const mockAccount = { id: mockAccountId, publicKey: '0x123', user: { id: 1 } } as Account;
  
    // Mock the accountRepository to return a predefined Account object
    jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(mockAccount);
  
    // Call the findOne method
    const account = await service.findOne(mockAccountId);
  
    // Check that the retrieved account matches the mock account
    expect(account).toEqual(mockAccount);
  });

  it('should throw NotFoundException when retrieving a non-existent account', async () => {
    // Mock account ID that does not exist
    const mockAccountId = 99;
  
    // Mock the accountRepository to return null
    jest.spyOn(accountRepository, 'findOne').mockResolvedValueOnce(null);
  
    // Expect the findOne method to throw a NotFoundException
    await expect(service.findOne(mockAccountId)).rejects.toThrow(NotFoundException);
  });

  // Accounts Listing Tests
  it('should list all accounts', async () => {
    // Mock account data
    const mockAccounts = [
      { id: 1, publicKey: '0x123', user: { id: 1 } },
      { id: 2, publicKey: '0x456', user: { id: 2 } },
    ] as Account[];
  
    // Mock the accountRepository to return predefined accounts
    jest.spyOn(accountRepository, 'find').mockResolvedValueOnce(mockAccounts);
  
    // Call the findAll method
    const accounts = await service.findAll();
  
    // Check that the listed accounts match the mock accounts
    expect(accounts.length).toEqual(mockAccounts.length);
    expect(accounts).toEqual(
      expect.arrayContaining(
        mockAccounts.map(account => ({
          id: account.id,
          publicKey: account.publicKey,
          user: { id: account.user.id },
        })),
      ),
    );
  });

  it('should handle listing accounts with a deleted user gracefully', async () => {
    // Mock account data with a deleted user (user is null)
    const mockAccounts = [
      { id: 1, publicKey: '0x123', user: null },
    ] as Account[];
  
    // Mock the accountRepository to return predefined accounts
    jest.spyOn(accountRepository, 'find').mockResolvedValueOnce(mockAccounts);
  
    // Call the findAll method
    const accounts = await service.findAll();
  
    // Check that the service returns null for the user field
    expect(accounts[0].user).toBeNull();
  });

});
