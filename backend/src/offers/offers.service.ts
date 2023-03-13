import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly  offerRepository: Repository<Offer>,
    private readonly  WishesService: WishesService,
  ) {}
  async create(user: User, createOfferDto: CreateOfferDto) {
    //найдем в базе подарок, на который будем скидываться
    const wish = await this.WishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Таких подарков нет (((');
    }

    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Сами себе на подарок не скидываем))');
    }

    // Проверим, что сумма собранных средств не превышает стоимости подарка.
    const offerSum = Number(wish.raised) + Number(createOfferDto.amount);
    if (+offerSum > wish.price) {
      throw new ForbiddenException('Деньги на подарок уже собраны');
    }

    //обновим данные для подарка с учетом собранных средств
    await this.WishesService.updateOne(
      wish.id,
      { raised: +offerSum },
      wish.owner.id,
    );

    //запишем новый offer в БД
    await this.offerRepository.save({ ...createOfferDto, user, item: wish });

    return null;
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: ['item', 'user'],
    });
    if (offers.length === 0) {
      throw new NotFoundException('Пока еще никто не делал предложений');
    }
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.find({
      where: { id },
      relations: ['item', 'user'],
    });
    if (offer.length === 0) {
      throw new NotFoundException('Таких предложений');
    }
    return offer;
  }

}
