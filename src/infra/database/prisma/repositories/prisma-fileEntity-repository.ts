import { PrismaService } from '../prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { FileEntity } from '@prisma/client';
import { Replace } from '../../../../application/helpers/Replace';

@Injectable()
export class PrismaFileEntityRepository {
  constructor(private prisma: PrismaService) {}

  async create(fileEntity: FileEntity): Promise<void> {
    await this.prisma.fileEntity.create({
      data: fileEntity,
    });
  }

  async findById(fileEntityId: number): Promise<FileEntity | null> {
    const fileEntity = await this.prisma.fileEntity.findUnique({
      where: {
        id: fileEntityId,
      },
    });

    if (!fileEntity) {
      return fileEntity;
    }

    return fileEntity;
  }

  async save(fileEntity: FileEntity): Promise<void> {
    await this.prisma.fileEntity.update({
      where: {
        id: fileEntity.id,
      },
      data: fileEntity,
    });
  }

  async createOrUpdate(
    fileEntity: Replace<
      FileEntity,
      { updatedAt?: Date; createdAt?: Date; id?: number }
    >,
  ): Promise<object> {
    let resultFileEntity: FileEntity;

    try {
      const isFileEntity = await this.prisma.fileEntity.findUnique({
        where: {
          key: fileEntity.key,
        },
      });
      if (isFileEntity) {
        resultFileEntity = await this.prisma.fileEntity.update({
          where: {
            id: isFileEntity.id,
          },
          data: fileEntity,
        });
      } else {
        resultFileEntity = await this.prisma.fileEntity.create({
          data: fileEntity,
        });
      }
      return resultFileEntity;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
