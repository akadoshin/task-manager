import { UnauthorizedException } from '@nestjs/common';

import { UserEntity } from '@/modules/users/entities/users.entity';

export class UserHelper {
  /**
   * Normalize a nickname
   * removing accents and converting to lowercase
   */
  static normalizeNickname(nickname: string): string {
    return nickname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[#\s]/g, '')
      .toLocaleLowerCase();
  }

  /**
   * Get the nickname and hash of a user
   * and concatenate them
   */
  static getNicknameAndHash<T extends UserEntity>(user: T): string {
    return `${user.nickname}#${user.hash}`;
  }

  static validateUserIp<T extends UserEntity>(user: T, ip: string): T {
    /**
     * If the user is found and the IP matches,
     * return the user
     */
    if (user?.ip !== ip) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
