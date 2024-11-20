import {
  Controller,
  Get,
  Body,
  Ip,
  UseGuards,
  SetMetadata,
  Patch,
} from '@nestjs/common';

/** constants */
import { EUsersRoutes, ERoutes } from '@constants/routes.constants';

/** guards */
import { AuthGuard } from '@/common/guards/auth.guard';

/** decorators */
import { CurrentUser } from '@/common/decorators/current-user.decorator';

/** service */
import { UsersService } from './users.service';

/** dto */
import { AuthDto } from '../auth/dto/login-auth.dto';
import { UserEntity } from './entities/users.entity';

@Controller(ERoutes.Users)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch(EUsersRoutes.Update)
  update(
    @Body() updateUserDto: AuthDto,
    @Ip() ip: string,
    @CurrentUser('id') id: number,
  ): Promise<Pick<UserEntity, 'nickname'>> {
    return this.usersService.update({
      ...updateUserDto,
      id,
      ip,
    });
  }

  @UseGuards(AuthGuard)
  @SetMetadata('allowExpired', 'true')
  @Get(EUsersRoutes.Suggestions)
  suggestions(@Ip() ip: string): Promise<string[]> {
    return this.usersService.suggestions(ip);
  }
}
