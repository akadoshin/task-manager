import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

/** prisma */
import { PrismaService } from '@/database/prisma.service';

/** types */
import { UserEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

/** helpers */
import { UserHelper } from '@helpers/user.helper';
import { UpdateUserDto } from './dto/update-user.dto';

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
    ip,
    nickname,
  }: UpdateUserDto): Promise<Pick<UserEntity, 'nickname'>> {
    const user = await this.findOneById(id);

    UserHelper.validateUserIp(user, ip);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        nickname: UserHelper.normalizeNickname(nickname),
      },
    });

    return new UserEntity({
      nickname: UserHelper.getNicknameAndHash(updatedUser),
    });
  }

  async suggestions(ip: string): Promise<string[] | null> {
    const users = await this.prismaService.user.findMany({
      where: {
        ip,
      },
    });

    if (!users?.length) {
      return null;
    }

    return users.map(UserHelper.getNicknameAndHash);
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

  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        id,
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
