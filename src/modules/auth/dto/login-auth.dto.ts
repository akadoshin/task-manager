import { PickType } from '@nestjs/mapped-types';

/** dto and entities */
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

export type TAuthResult = {
  userNickname: string;
};

export class AuthDto extends PickType(CreateUserDto, ['nickname'] as const) {}
