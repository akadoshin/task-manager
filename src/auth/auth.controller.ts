import {
  Controller,
  Post,
  Get,
  Body,
  Ip,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';

/** constants */
import { EAuthRoutes, ERoutes } from '@constants/routes.constants';

/** guards */
import { AuthGuard } from './auth.guard';

/** service */
import { type TAuthInput, AuthService } from './auth.service';

@Controller(ERoutes.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(EAuthRoutes.Login)
  login(@Body() { nickname }: Pick<TAuthInput, 'nickname'>, @Ip() ip: string) {
    return this.authService.authenticate({
      nickname,
      ip,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(EAuthRoutes.Register)
  register(@Body() { nickname }: TAuthInput, @Ip() ip: string) {
    return this.authService.register({
      nickname,
      ip,
    });
  }

  @UseGuards(AuthGuard)
  @SetMetadata('allowExpired', 'true')
  @Get(EAuthRoutes.Suggestions)
  suggestions(@Ip() ip: string) {
    return this.authService.suggestions(ip);
  }
}
