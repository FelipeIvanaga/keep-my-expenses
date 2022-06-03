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

    prisma.user.create = jest.fn().mockResolvedValue({});
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    const uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    it('should call prisma with correct values', async () => {
      const newUserData: CreateUserDto = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      };

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
  });
});
