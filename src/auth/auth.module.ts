import { Module } from '@nestjs/common';

/** service and controller */
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

/** external modules */
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
