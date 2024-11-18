import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/** external services */
import { JwtService } from '@nestjs/jwt';
import { TUser, UsersService } from '@/users/users.service';

/** helpers */
import { UserHelper } from '@helpers/user.helper';

export type TAuthInput = Pick<TUser, 'nickname' | 'ip'>;

type TAuthResult = {
  userId: TUser['id'];
  userNickname: string;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    input: Pick<TAuthInput, 'nickname' | 'ip'>,
  ): Promise<TUser | null> {
    /**
     * Check if the nickname has a hash
     */
    if (!input.nickname.includes('#')) {
      throw new BadRequestException('Hash is missing');
    }

    const [nickname, hash] = input.nickname.split('#');
    const user = await this.usersService.findOne(nickname, +hash);

    /**
     * If the user is found and the IP matches,
     * return the user
     */
    if (user && user.ip === input.ip) {
      return user;
    }

    return null;
  }

  async authenticate(
    input: Pick<TAuthInput, 'nickname' | 'ip'>,
  ): Promise<TAuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async register(input: TAuthInput): Promise<TAuthResult> {
    const user = await this.usersService.create(input.nickname, input.ip);

    return this.signIn(user);
  }

  async signIn(input: TUser): Promise<TAuthResult> {
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

  async suggestions(
    ip: string,
  ): Promise<Pick<TAuthInput, 'nickname'>[] | null> {
    const users = await this.usersService.findAllByIp(ip);

    if (!users?.length) {
      return null;
    }

    return users.map((u) => ({ nickname: UserHelper.getNicknameAndHash(u) }));
  }
}
