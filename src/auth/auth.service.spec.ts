import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

/** service and controller */
import { AuthService } from './auth.service';

/** external services */
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
    findAllByIp: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockImplementation(() => '1234567890'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should throw BadRequestException if user does not have hash', async () => {
      const input = { nickname: 'testUser', ip: '127.0.0.1' };

      await expect(authService.validateUser(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return user if user is found', async () => {
      const input = { nickname: 'testUser#1234', ip: '127.0.0.1' };
      const user = { id: 1, nickname: 'testUser', ip: '127.0.0.1', hash: 1234 };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await authService.validateUser(input);

      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('testUser', 1234);
    });

    it('should return null if user is not found', async () => {
      const input = { nickname: 'testUser#1234', ip: '127.0.0.1' };

      mockUsersService.findOne.mockResolvedValue(null);

      const result = await authService.validateUser(input);

      expect(result).toBeNull();
      expect(mockUsersService.findOne).toHaveBeenCalledWith('testUser', 1234);
    });
  });

  describe('authenticate', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      const input = { nickname: 'testUser#1234', ip: '127.0.0.1' };

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(authService.authenticate(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user have different ip', async () => {
      const input = { nickname: 'testUser#1234', ip: '127.0.0.2' };
      const user = { id: 1, nickname: 'testUser', ip: '127.0.0.1', hash: 1234 };

      mockUsersService.findOne.mockResolvedValue(user);

      await expect(authService.authenticate(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return auth data if user is found', async () => {
      const input = { nickname: 'testUser#1234', ip: '127.0.0.1' };
      const user = { id: 1, ip: '127.0.0.1', nickname: 'testUser', hash: 1234 };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await authService.authenticate(input);

      expect(result).toEqual({
        userId: 1,
        userNickname: `${user.nickname}#${user.hash}`,
        accessToken: '1234567890',
      });
    });
  });

  describe('suggestions', () => {
    it('should return null if users are not found', async () => {
      const ip = '127.0.0.1';

      mockUsersService.findAllByIp.mockResolvedValue(null);

      const result = await authService.suggestions(ip);

      expect(result).toBeNull();
      expect(mockUsersService.findAllByIp).toHaveBeenCalledWith(ip);
    });

    it('should return suggestions if users are found', async () => {
      const ip = '127.0.0.1';

      const users = [
        { ip: '127.0.0.1', nickname: 'testUser1', hash: 1234 },
        { ip: '127.0.0.1', nickname: 'testUser2', hash: 5678 },
      ];

      mockUsersService.findAllByIp.mockResolvedValue(users);

      const result = await authService.suggestions(ip);

      expect(result).toEqual([
        { nickname: 'testUser1#1234' },
        { nickname: 'testUser2#5678' },
      ]);
      expect(mockUsersService.findAllByIp).toHaveBeenCalledWith(ip);
    });
  });
});
