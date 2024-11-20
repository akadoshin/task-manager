import { Module } from '@nestjs/common';

/** database */
import { PrismaModule } from '@/database/prisma.module';

/** services */
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
