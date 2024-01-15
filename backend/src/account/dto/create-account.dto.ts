import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateAccountDto {
  @IsNotEmpty()
  user: User;
}
