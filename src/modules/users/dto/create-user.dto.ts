import { IsIP, IsString, MaxLength, MinLength } from 'class-validator';

/** entities */
import { UserEntity } from '../entities/users.entity';

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
