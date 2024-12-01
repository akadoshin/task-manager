import {
  Controller,
  Post,
  Body,
  Ip,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';

/** constants */
import { EAuthRoutes, ERoutes } from '@constants/routes.constants';

/** service */
import { AuthService } from './auth.service';

/** dto */
import { AuthDto, TAuthResult } from './dto/login-auth.dto';

@Controller(ERoutes.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(EAuthRoutes.Login)
  login(
    @Body() authDto: AuthDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TAuthResult> {
    return this.authService.authenticate(
      {
        ...authDto,
        ip,
      },
      response,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(EAuthRoutes.Register)
  register(
    @Body() authDto: AuthDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TAuthResult> {
    return this.authService.register(
      {
        ...authDto,
        ip,
      },
      response,
    );
  }
}
