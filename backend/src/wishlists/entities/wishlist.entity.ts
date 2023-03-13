import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

//Cхема списка подарков (wishlist):
@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //name — название списка.
  @Column()
  @Length(1, 250)
  name: string;

  //description — описание подборки, строка до 1500 символов;
  @Column({ default: ''})
  @Length(0, 1500)
  description: string;

  //image — обложка для подборки;
  @Column({
    default: 'https://picsum.photos/200',
  })
  @IsUrl()
  image: string;

  //items содержит набор ссылок на подарки.
  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  // создатель подарка
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
