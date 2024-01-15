import { IsNotEmpty } from 'class-validator';

// import { User } from '../../user/user.entity';
// Change logic create account:
// receive a user Id from request body in the CreateAccountDto, fetch the corresponding User entity from the database, 
// and then use it to create an account


export class CreateAccountDto {
  @IsNotEmpty()
  user: number; // was User entity
}
