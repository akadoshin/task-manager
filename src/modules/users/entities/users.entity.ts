export class UserEntity {
  id: number;
  nickname: string;
  hash: number;
  ip: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
