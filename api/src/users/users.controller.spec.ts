import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let sut: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    sut = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    usersService.create = jest.fn().mockResolvedValue({});
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('create', () => {
    const newUserData: CreateUserDto = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    };

    it('should call usersService with correct values', async () => {
      sut.create(newUserData);
      expect(usersService.create).toBeCalledTimes(1);
      expect(usersService.create).toBeCalledWith(newUserData);
    });
  });
});
