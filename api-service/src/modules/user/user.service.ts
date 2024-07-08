import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient, User } from '@prisma/client/edge';
import { CreateUserDto } from './dto/createUser.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async register({ email, role }: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        role,
        password: randomUUID().replace(/-/g, ''),
      }
    })   
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({where: {email}});
  }

}
