import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AccountService } from './account.service';
// add imports
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../user/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

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



});
