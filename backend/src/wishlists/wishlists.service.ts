import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly  wishlistsRepository: Repository<Wishlist>,
    private readonly  wishesService: WishesService,
  ) {}
  async create(user:User, createWishlistDto: CreateWishlistDto) {
//соберем все подарки в одном массиве, в соответствии с их id
    const wishes= await this.wishesService.find({
      where: { id: In(createWishlistDto.itemsId) },
    });
    //запишем новый wishlist в БД
    return  await this.wishlistsRepository.save({ ...createWishlistDto, items: wishes, owner: user, });

  }

  async findAll() {
    return  await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  findOne(id: number) {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner','items']
    })
  }

  async update(user: User, wishlistId: number, updateWishlistDto: UpdateWishlistDto) {
    
    const wishlist = await this.findOne(wishlistId);
    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }

    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужие списки');
    }
    //соберем все подарки в одном массиве, в соответствии с их id
    const wishes = await this.wishesService.find({
      where: { id: In(updateWishlistDto.itemsId )},
    });
    return await this.wishlistsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes,
    })
  }

  async remove(wishlistId: number, userId: number) {

    const wishlist = await this.findOne(wishlistId);

    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужие списки');
    }

    await this.wishlistsRepository.delete(wishlistId);
    return wishlist;
  }
}
