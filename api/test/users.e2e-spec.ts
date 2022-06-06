import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { PrismaService } from '../src/prisma.service';
import { APP_PIPE } from '@nestjs/core';

describe('UsersController (e2e)', () => {
  let sut: INestApplication;
  const prisma = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
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

    it('should not be able to create two users with same email', async () => {
      await request(sut.getHttpServer())
        .post('/users')
        .send(newUserData)
        .expect(201);

      return request(sut.getHttpServer())
        .post('/users')
        .send(newUserData)
        .expect(400);
    });

    it('should return status 400 when email is missing', () => {
      return request(sut.getHttpServer())
        .post('/users')
        .send({
          name: newUserData.name,
          password: newUserData.password,
        })
        .expect(400);
    });

    it('should return status 400 when password is missing', () => {
      return request(sut.getHttpServer())
        .post('/users')
        .send({
          name: newUserData.name,
          email: newUserData.email,
        })
        .expect(400);
    });

    it('should return status 400 when name is missing', () => {
      return request(sut.getHttpServer())
        .post('/users')
        .send({
          email: newUserData.email,
          password: newUserData.password,
        })
        .expect(400);
    });
  });
});
