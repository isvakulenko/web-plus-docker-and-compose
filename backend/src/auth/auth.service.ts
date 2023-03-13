/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    // тут будем генерировать токен
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
  
  // метод validatePassword проверяет,
  //  совпадает ли пароль пользователя с тем, что есть в базе.
  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUserName(username); 
    /* В идеальном случае пароль обязательно должен быть захэширован */
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    }
    if (user && passwordCompare) {
      /* Исключаем пароль из результата */
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  }
