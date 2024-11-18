import { Injectable } from '@nestjs/common';

/** helpers */
import { UserHelper } from '@helpers/user.helper';

export type TUser = {
  id: number;
  nickname: string;
  hash: number;
  ip: string;
};

@Injectable()
export class UsersService {
  private users: TUser[] = [
    {
      id: 1,
      ip: '127.0.0.1',
      nickname: 'akadoshin',
      hash: 2342,
    },
    {
      id: 2,
      ip: '127.0.0.1',
      nickname: 'villosaurio',
      hash: 5342,
    },
    {
      id: 3,
      ip: '156.87.54.56',
      nickname: 'joseph',
      hash: 7485,
    },
  ];

  async findOne(nickname: string, hash: number): Promise<TUser | undefined> {
    return this.users.find(
      (u) =>
        u.nickname === UserHelper.normalizeNickname(nickname) &&
        u.hash === hash,
    );
  }

  async findAllByIp(ip: string): Promise<TUser[]> {
    return this.users.filter((u) => u.ip === ip);
  }

  async create(nickname: string, ip: string): Promise<TUser> {
    const user = {
      id: this.users.length + 1,
      hash: this.generateHash(),
      nickname: UserHelper.normalizeNickname(nickname),
      ip,
    };

    this.users.push(user);

    return user;
  }
  /**
   * Generate a random hash
   *
   * check if it's already taken
   * if it is, generate another one
   */
  private generateHash(): number {
    /**
     * Generate a random number between 1000 and 9999
     * to be used as a hash
     */
    const generate = () => Math.floor(1000 + Math.random() * 9000);

    let hash = generate();

    /** check if the hash is already taken */
    while (this.isHashTaken(hash)) {
      hash = generate();
    }

    return hash;
  }

  /**
   * Check if a hash is already taken
   */
  private isHashTaken(hash: number): boolean {
    return this.users.some((u) => u.hash === hash);
  }
}
