import { BadRequestException, Injectable } from '@nestjs/common';

/** types */
import { UserEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

/** helpers */
import { UserHelper } from '@helpers/user.helper';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [
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

  async create({ nickname, ip }: CreateUserDto): Promise<UserEntity> {
    const dto = new CreateUserDto();
    dto.nickname = nickname;
    dto.ip = ip;

    const errors = await validate(dto);

    if (errors.length) {
      throw new BadRequestException(errors.toString());
    }

    const user = new UserEntity({
      id: this.users.length + 1,
      hash: this.generateHash(),
      nickname: UserHelper.normalizeNickname(nickname),
      ip,
    });

    this.users.push(user);

    return user;
  }

  async findOne({
    nickname,
    hash,
  }: Pick<UserEntity, 'nickname' | 'hash'>): Promise<UserEntity | undefined> {
    return this.users.find((u) => u.nickname === nickname && u.hash === hash);
  }

  async findAllByIp(ip: string): Promise<UserEntity[]> {
    return this.users.filter((u) => u.ip === ip);
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
