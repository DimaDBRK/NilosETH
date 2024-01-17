import { User } from '../user/user.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Account {
  // @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;

  @ManyToOne(() => User, user => user.accounts)
  user: User;
}
