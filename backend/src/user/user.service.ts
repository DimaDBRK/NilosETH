import { Get, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
// exclude password in return get endpoints
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
// create user DTO
import { UserResponseDto } from './dto/user-response.dto';
// Import the Account entity
import { Account } from '../account/account.entity'; 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // Add Account
    @InjectRepository(Account) 
    private accountRepository: Repository<Account>, 
  ) {}

  async createUser(user: User):  Promise<UserResponseDto> {
    try {
      const saltOrRounds = 10;
      user.password = await bcrypt.hash(user.password, saltOrRounds);
      const createdUser = await this.userRepository.save(user);
      // Return UserResponseDto
      return {
        id: createdUser.id,
        username: createdUser.username
      };
    } catch (error) {
      // Check for a unique constraint violation
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed')) {
        throw new BadRequestException('A user with this username already exists.');
      }
      // Re-throw the error if it's not the unique constraint violation
      throw error;
    }
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {id},
      relations: ['accounts']
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { 
      id: user.id, 
      username: user.username,
      // Map each account to its ID 
      accounts: user.accounts.map(account => account.id) 
    };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find({ relations: ['accounts'] });
    return users.map(user => ({ 
      id: user.id, 
      username: user.username,
      // Map each account to its ID
      accounts: user.accounts.map(account => account.id) 
     }));
  }

  async findOneByUsername(username: string): Promise<any> {
    const user = await this.userRepository.findOne({where: {username}});
    if (!user) {
      throw new NotFoundException(`User with ID ${username} not found`);
    }
    return user;
  }
  // Delete user added 
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {id},
      relations: ['accounts']
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    // Disassociate accounts from the user
    if (user.accounts) {
      for (const account of user.accounts) {
        account.user = null;
        await this.accountRepository.save(account);
      }
    }
  
    // Delete user
    await this.userRepository.remove(user);
  }
}
