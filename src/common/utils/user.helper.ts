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
  static getNicknameAndHash<T>(user: T): string {
    return `${user['nickname']}#${user['hash']}`;
  }
}
