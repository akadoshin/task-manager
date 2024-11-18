import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { UsersService } from './users.service';

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
      const user = await service.findOne('akadoshin', 2342);
      expect(user).toEqual({
        id: 1,
        ip: '127.0.0.1',
        nickname: 'akadoshin',
        hash: 2342,
      });
    });

    it('should return undefined if user is not found', async () => {
      const user = await service.findOne('none', 0);
      expect(user).toBeUndefined();
    });

    it('validate normalization', async () => {
      const user = await service.findOne('AkádoShiN', 2342);
      expect(user).toHaveProperty('nickname', 'akadoshin');
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
      const createdUser = await service.create('newUser', '127.0.0.1');
      const user = await service.findOne(
        createdUser.nickname,
        createdUser.hash,
      );

      expect(user).toHaveProperty('hash');

      expect(user.hash).toBeGreaterThan(1000);
      expect(user.hash).toBeLessThan(9999);

      expect(user).toHaveProperty('nickname', 'newuser');
      expect(user).toHaveProperty('ip', '127.0.0.1');
    });
  });
});
