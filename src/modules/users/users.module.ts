import { Module } from '@nestjs/common';

/** database */
import { DatabaseModule } from '@/database/database.module';

/** services */
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
