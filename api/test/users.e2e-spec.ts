import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { PrismaService } from '../src/prisma.service';

describe('UsersController (e2e)', () => {
  let sut: INestApplication;
  const prisma = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    sut = moduleFixture.createNestApplication();
    await sut.init();

    await prisma.user.deleteMany();
  });

  const newUserData: CreateUserDto = {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
  };

  describe('/ (POST)', () => {
    it('should add user', () => {
      return request(sut.getHttpServer())
        .post('/users')
        .send(newUserData)
        .expect(201);
    });
  });
});
