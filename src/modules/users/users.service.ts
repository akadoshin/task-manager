import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

/** prisma */
import { PrismaService } from '@/database/prisma/prisma.service';

/** types */
import { UserEntity } from './entities/users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

/** helpers */
import { UserHelper } from '@helpers/user.helper';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ nickname, ip }: CreateUserDto): Promise<UserEntity> {
    const dto = new CreateUserDto({
      nickname,
      ip,
    });

    const errors = await validate(dto);

    if (errors.length) {
      throw new BadRequestException(errors.toString());
    }

    while (true) {
      try {
        const user = await this.prismaService.user.create({
          data: {
            hash: this.generateHash(),
            nickname: UserHelper.normalizeNickname(nickname),
            ip,
          },
        });

        return user;
      } catch (error) {
        /**
         * if the hash is already taken, generate another one
         * and the while loop will try again
         */
        if (error.code === 'P2002') {
          continue;
        } else {
          throw new BadRequestException(
            'An error occurred while creating the user',
          );
        }
      }
    }
  }

  async update({
    id,
    nickname,
  }: Pick<UserEntity, 'nickname' | 'id'>): Promise<UserEntity> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        nickname: UserHelper.normalizeNickname(nickname),
      },
    });
  }

  async findOne({
    nickname,
    hash,
  }: Pick<UserEntity, 'nickname' | 'hash'>): Promise<UserEntity | undefined> {
    return this.prismaService.user.findFirst({
      where: {
        nickname,
        hash,
      },
    });
  }

  async findAllByIp(ip: string): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      where: {
        ip,
      },
    });
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
    return Math.floor(1000 + Math.random() * 9000);
  }
}
