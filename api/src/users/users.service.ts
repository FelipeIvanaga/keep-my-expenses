import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash as generateHash } from 'bcrypt';
import { v4 as generateUuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password }: CreateUserDto) {
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

    return user;
  }
}
