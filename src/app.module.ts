import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [AuthModule, UsersModule, WorkspacesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
