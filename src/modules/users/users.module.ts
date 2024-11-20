import { Module } from '@nestjs/common';

/** database */
import { PrismaModule } from '@/database/prisma.module';

/** services */
import { UsersService } from './users.service';

/** controllers */
import { UserController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
