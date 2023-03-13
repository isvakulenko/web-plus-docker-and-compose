import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { Length, IsUrl, IsArray, IsNumber } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  name?: string;

  @IsUrl()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId?: number[];

  @Length(0, 1500)
  description?: string;
}
