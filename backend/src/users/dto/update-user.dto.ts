import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Length, IsUrl, IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(2, 30)
  username?: string;

  @Length(2, 200)
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;
  
  @Length(3, 10)
  password?: string;
}
