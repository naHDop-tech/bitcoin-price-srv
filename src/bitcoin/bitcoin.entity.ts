import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bitcoin')
export class BitcoinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({ name: 'bid_price' })
  bidPrice: string;

  @Column({ name: 'ask_price' })
  askPrice: string;
}
