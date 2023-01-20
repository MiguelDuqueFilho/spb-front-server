import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../../infra/prisma/repositories/prisma-user-repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaUserRepository],
})
export class UserModule {}
