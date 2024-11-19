import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findOne', () => {
    it('should return an user by nickname', async () => {
      const user = await service.findOne({
        nickname: 'akadoshin',
        hash: 2342,
      });

      expect(user).toEqual({
        id: 1,
        ip: '127.0.0.1',
        nickname: 'akadoshin',
        hash: 2342,
      });
    });

    it('should return undefined if user is not found', async () => {
      const user = await service.findOne({
        nickname: 'unknown',
        hash: 2342,
      });

      expect(user).toBeUndefined();
    });
  });

  describe('findAllByIp', () => {
    it('should return all users by ip', async () => {
      const users = await service.findAllByIp('127.0.0.1');
      expect(users).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createdUser = await service.create({
        nickname: 'newUser',
        ip: '127.0.0.1',
      });

      const user = await service.findOne({
        nickname: createdUser.nickname,
        hash: createdUser.hash,
      });

      expect(user).toHaveProperty('hash');

      expect(user.hash).toBeGreaterThan(1000);
      expect(user.hash).toBeLessThan(9999);

      expect(user).toHaveProperty('nickname', 'newuser');
      expect(user).toHaveProperty('ip', '127.0.0.1');
    });

    it('validate normalization', async () => {
      const user = await service.create({
        nickname: 'AkádoShiN',
        ip: '127.0.0.1',
      });

      expect(user).toHaveProperty('nickname', 'akadoshin');
    });

    it('should throw an error if ip is invalid', async () => {
      await expect(
        service.create({ nickname: 'newUser', ip: 'invalid' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if nickname is invalid', async () => {
      await expect(
        service.create({ nickname: 'a', ip: '127.0.0.1' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
