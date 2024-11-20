import { PickType } from '@nestjs/mapped-types';

/** dto and entities */
import { UserEntity } from '@/modules/users/entities/users.entity';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

export type TAuthResult = {
  userId: UserEntity['id'];
  userNickname: string;
  accessToken: string;
};

export class AuthDto extends PickType(CreateUserDto, ['nickname'] as const) {}
