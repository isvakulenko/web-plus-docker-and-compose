import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

//Схема желающих скинуться (offer):
@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // user содержит id желающего скинуться;
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  //item содержит ссылку на товар;
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  //amount — сумма заявки, округляется до двух знаков после запятой;
  @Column()
  amount: number;

  // hidden — флаг, который определяет показывать ли
  // информацию о скидывающемся в списке.
  @Column({
    default: false,
  })
  hidden: boolean;
}
