import { Entity, Column, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity()
export class User {
  // @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];
}
