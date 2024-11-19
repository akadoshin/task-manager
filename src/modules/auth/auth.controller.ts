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
import { AuthGuard } from '../../common/guards/auth.guard';

/** service */
import { AuthService } from './auth.service';

/** dto */
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller(ERoutes.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(EAuthRoutes.Login)
  login(@Body() { nickname }: LoginAuthDto, @Ip() ip: string) {
    return this.authService.authenticate({
      nickname,
      ip,
    });
  }

  @Post(EAuthRoutes.Register)
  register(@Body() { nickname }: LoginAuthDto, @Ip() ip: string) {
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
