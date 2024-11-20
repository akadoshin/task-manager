import { BadRequestException, Injectable } from '@nestjs/common';

/** external services */
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';

/** dto and entities */
import { TAuthResult } from './dto/login-auth.dto';
import { UserEntity } from '@/modules/users/entities/users.entity';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

/** helpers */
import { UserHelper } from '@helpers/user.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async signIn(input: UserEntity): Promise<TAuthResult> {
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

  async authenticate(input: CreateUserDto): Promise<TAuthResult> {
    /**
     * Check if the nickname has a hash
     */
    if (!input.nickname.includes('#')) {
      throw new BadRequestException('Hash is missing');
    }

    const [nickname, hash] = input.nickname.split('#');
    const user = await this.usersService.findOne({ nickname, hash: +hash });

    UserHelper.validateUserIp(user, input.ip);

    return this.signIn(user);
  }

  async register(input: CreateUserDto): Promise<TAuthResult> {
    const user = await this.usersService.create(input);

    return this.signIn(user);
  }
}
