import { PickType } from '@nestjs/mapped-types';

/** dto */
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

export class LoginAuthDto extends PickType(CreateUserDto, [
  'nickname',
] as const) {}
