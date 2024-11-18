import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/** external services */
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { sub, nickname } = await this.jwtService.verifyAsync(token);

      request.user = {
        sub,
        nickname,
      };

      return true;
    } catch (error) {
      const allowExpired = this.reflector.get<string>(
        'allowExpired',
        context.getHandler(),
      );

      if (allowExpired) {
        const isExpired = error.name === TokenExpiredError.name;

        if (isExpired) {
          return true;
        }
      }

      throw new UnauthorizedException();
    }
  }
}
