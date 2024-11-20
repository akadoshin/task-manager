import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/** external services */
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';

/** dto and entities */
import { UserEntity } from '@/modules/users/entities/users.entity';
import {
  CreateUserDto,
  UpdateUserDto,
} from '@/modules/users/dto/create-user.dto';

/** helpers */
import { UserHelper } from '@helpers/user.helper';

type TAuthResult = {
  userId: UserEntity['id'];
  userNickname: string;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private validateUserIp(user: UserEntity, ip: string): UserEntity {
    /**
     * If the user is found and the IP matches,
     * return the user
     */
    if (user?.ip !== ip) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateUser(input: CreateUserDto): Promise<UserEntity> {
    /**
     * Check if the nickname has a hash
     */
    if (!input.nickname.includes('#')) {
      throw new BadRequestException('Hash is missing');
    }

    const [nickname, hash] = input.nickname.split('#');
    const user = await this.usersService.findOne({ nickname, hash: +hash });

    return this.validateUserIp(user, input.ip);
  }

  async authenticate(input: CreateUserDto): Promise<TAuthResult> {
    const user = await this.validateUser(input);

    return this.signIn(user);
  }

  async register(input: CreateUserDto): Promise<TAuthResult> {
    const user = await this.usersService.create(input);

    return this.signIn(user);
  }

  async update(input: UpdateUserDto): Promise<TAuthResult> {
    const user = await this.usersService.findOneById(input.id);

    this.validateUserIp(user, input.ip);

    const updatedUser = await this.usersService.update({
      id: user.id,
      nickname: input.nickname,
    });

    return this.signIn(updatedUser);
  }

  async signIn(input: UserEntity): Promise<TAuthResult> {
    const tokenPayload = {
      sub: input.id,
      nickname: UserHelper.getNicknameAndHash(input),
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      userId: input.id,
      userNickname: UserHelper.getNicknameAndHash(input),
    };
  }

  async suggestions(ip: string): Promise<string[] | null> {
    const users = await this.usersService.findAllByIp(ip);

    if (!users?.length) {
      return null;
    }

    return users.map(UserHelper.getNicknameAndHash);
  }
}
