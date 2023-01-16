import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../infra/database/prisma/repositories/prisma-user-repository';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaUserRepository: PrismaUserRepository) {}
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prismaUserRepository.save(userId, dto);
    return user;
  }
}
