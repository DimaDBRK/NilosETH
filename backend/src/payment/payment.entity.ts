import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity()
export class Payment {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'from' })
  from: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'to' })
  to: Account;

  @Column('bigint')
  amount: number;
}
