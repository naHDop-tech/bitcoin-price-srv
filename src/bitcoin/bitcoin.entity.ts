import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BitcoinEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  symbol: string;

  @Column({ name: 'bid_price' })
  bidPrice: string;

  @Column({ name: 'ask_price' })
  askPrice: string;
}
