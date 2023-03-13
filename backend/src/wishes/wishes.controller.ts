import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  //создаем новый подарок
  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  //последние 40 созданных подарковъ
  @Get('last')
  async getLastWishes() {
    const lastWishes = await this.wishesService.getLastNumberWishes();
    return lastWishes;
  }

  //20 самых желанных подарков
  @Get('top')
  async getTopNumberWish() {
    const topWishes = await this.wishesService.getTopNumberWishes();
    return topWishes;
  }
  //найди подарок по id
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }
  //редактировать конкретный подарок по id
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() UpdatedWish: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, UpdatedWish, req.user.id);
  }

  //удалить конкретный подарок по id
  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(@Req() req, @Param('id') id: string) {
    return await this.wishesService.removeOne(+id, req.user.id);
  }
  //скопировать себе понравившийся подарок
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: string) {
    return await this.wishesService.copyWish(+id, req.user);
  }
}
