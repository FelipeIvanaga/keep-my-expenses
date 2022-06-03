import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash as generateHash } from 'bcrypt';
import { v4 as generateUuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password }: CreateUserDto) {
    try {
      const emailAlreadyRegistered = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!!emailAlreadyRegistered) {
        throw new BadRequestException('email already registered');
      }

      const id = generateUuid();
      const hash = await generateHash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          id,
          name,
          email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (err: unknown) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}
