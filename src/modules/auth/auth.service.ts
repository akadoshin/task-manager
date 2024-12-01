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

  private async signIn(
    input: UserEntity,
    response: Response,
  ): Promise<TAuthResult> {
    const tokenPayload = {
      sub: input.id,
      nickname: UserHelper.getNicknameAndHash(input),
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    this.setAuthCookie(accessToken, response);

    return {
      userNickname: UserHelper.getNicknameAndHash(input),
    };
  }

  private setAuthCookie(accessToken: string, httpResponse: any): void {
    httpResponse?.cookie('access_token', accessToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
    });
  }

  async authenticate(
    input: CreateUserDto,
    response: Response,
  ): Promise<TAuthResult> {
    /**
     * Check if the nickname has a hash
     */
    if (!input.nickname.includes('#')) {
      throw new BadRequestException('Hash is missing');
    }

    const [nickname, hash] = input.nickname.split('#');
    const user = await this.usersService.findOne({ nickname, hash: +hash });

    UserHelper.validateUserIp(user, input.ip);

    return this.signIn(user, response);
  }

  async register(
    input: CreateUserDto,
    response: Response,
  ): Promise<TAuthResult> {
    const user = await this.usersService.create(input);

    return this.signIn(user, response);
  }
}
