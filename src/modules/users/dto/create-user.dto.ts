import {
  IsIP,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** entities */
import { UserEntity } from '../entities/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto implements Partial<UserEntity> {
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  nickname: string;

  @IsIP()
  ip: string;

  constructor(partial: Partial<CreateUserDto> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  currentNickname: string;
}
