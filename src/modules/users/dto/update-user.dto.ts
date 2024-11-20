import { IsNumber } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  id: number;

  constructor(partial: Partial<UpdateUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
