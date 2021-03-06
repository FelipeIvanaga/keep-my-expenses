import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let sut: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    sut = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.user.create = jest.fn().mockResolvedValue({
      id: 'f07583f1-c0ec-4a43-bb31-8598eae361de',
      name: 'any_name',
      email: 'any_email@email.com',
      hash: '$2b$10$0e/yfwKADK/Epxyj/aklNOtp88ei1ZPccsXhMucUy4Jg/G34aVonC',
    });
    prisma.user.findUnique = jest.fn().mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    const newUserData: CreateUserDto = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    };

    it('should call prisma with correct values', async () => {
      await sut.create(newUserData);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: expect.stringMatching(uuidRegex),
          name: newUserData.name,
          email: newUserData.email,
          hash: expect.not.stringContaining(newUserData.password),
        },
      });
    });

    it('should return user when created', async () => {
      const user = await sut.create(newUserData);

      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
    });

    it('should not return user hash', async () => {
      const user = await sut.create(newUserData);

      expect(user.hash).toBeUndefined();
    });

    it('should not create user with an already registered email', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValueOnce({
        id: 'f07583f1-c0ec-4a43-bb31-8598eae361de',
        name: 'any_name',
        email: 'any_email@email.com',
        hash: '$2b$10$0e/yfwKADK/Epxyj/aklNOtp88ei1ZPccsXhMucUy4Jg/G34aVonC',
      });

      await expect(sut.create(newUserData)).rejects.toThrowError(
        new BadRequestException('email already registered'),
      );
    });

    it('should throw InternalServerErrorException when prisma create function throws', async () => {
      prisma.user.create = jest.fn().mockRejectedValueOnce(new Error());

      expect(sut.create(newUserData)).rejects.toThrowError(
        new InternalServerErrorException(),
      );
    });

    it('should throw InternalServerErrorException when prisma findUnique function throws', async () => {
      prisma.user.findUnique = jest.fn().mockRejectedValueOnce(new Error());

      expect(sut.create(newUserData)).rejects.toThrowError(
        new InternalServerErrorException(),
      );
    });
  });
});
