import { user } from '@prisma/client';

export class UserEntity implements user {
  id: number;
  nickname: string;
  hash: number;
  ip: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
