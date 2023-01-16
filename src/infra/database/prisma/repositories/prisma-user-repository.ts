import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { EditUserDto } from '../../../../application/user/dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from '../../../../application/auth/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class PrismaUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }

  async create(dto: AuthDto, hash: string): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        } else {
          throw error;
        }
      }
    }
  }

  async findByEmail(dto: AuthDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    delete user.hash;

    return user;
  }
}
