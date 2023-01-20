import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaFileEntityRepository } from '../prisma/repositories/prisma-fileEntity-repository';
import { multerOptionsFactory } from './multer.options.factory';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [S3Controller],
  providers: [S3Service, PrismaFileEntityRepository],
})
export class S3Module {}
