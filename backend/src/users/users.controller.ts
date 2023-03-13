import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserPasswordInterceptor } from 'src/interceptors/user-password.interceptor';

@UseInterceptors(UserPasswordInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //для просмотра своего профиля
  @Get('me')
  async findOwnOne(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    return user;
  }

  //для обновления своего профиля
  @Patch('me')
  async updateOne(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }
  //поиск в базе по имени пользователя
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByUserName(username);
    return user;
  }
  //поиск в базе по имени или почте пользователя
  @Post('find')
  async findMany(@Body() findUser: FindUserDto) {
    const user = await this.usersService.findMany(findUser);
    return user;
  }

  //Все подарки, созданные текущим пользователем
  @Get('me/wishes')
  async getOwnUserWishes(@Req() req ): Promise<Wish[]> {
    return await this.usersService.getOwnUserWishes(req.user.id);
  }

  //подарки, созданные другими пользователями
   @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUserName(username);
   return await this.usersService.getOwnUserWishes(user.id);    
   }

}
