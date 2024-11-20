import * as fs from 'node:fs';

import { Module } from '@nestjs/common';

/** external modules */
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/modules/users/users.module';

/** service and controller */
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY, 'utf8'),
      publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY, 'utf8'),
      signOptions: { algorithm: 'ES256', expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
