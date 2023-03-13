import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import * as bcrypt from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const { password, ...result } = user;
    const hash = await bcrypt.hash(password, 10);
    return await this.userRepository.save({ password: hash, ...result });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
  async findByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    //Измененнный пароль надо захешировать
    const { password } = updateUserDto;
    const hash = await bcrypt.hash(password, 10)
    if (password) {
    const user = await this.userRepository.update( id , {...updateUserDto, password: hash});
    return user;
  } else {
    return await this.userRepository.update( id, updateUserDto);
  }
  }

  async findMany({ query }: FindUserDto): Promise<User[]> {
      const users = await this.userRepository.find({
        where: [{ email: query }, { username: query }],
      });
      if (!users) {
        throw new NotFoundException(' Пользователь не найден...');
      }
      return users;
    }

    async getOwnUserWishes(id: number) {
     const wishes = await this.wishRepository.find({
        where: { owner: {id} },
        relations: ['owner']
      });

      return wishes
    }

}
