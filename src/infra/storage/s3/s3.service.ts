import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaFileEntityRepository } from '../../database/prisma/repositories/prisma-fileEntity-repository';
import AWS from 'aws-sdk/';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    region: this.config.get<string>('AWS_REGION'),
    credentials: {
      accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY'),
    },
  });
  constructor(
    private config: ConfigService,
    private prismaFileEntityRepository: PrismaFileEntityRepository,
  ) {}

  async uploadS3Files(files: Express.MulterS3.File[]) {
    const upLoadS3Files = [];
    for (const element of files) {
      const file = {
        originalName: element.originalname,
        bucket: element.bucket,
        key: element.key,
        mimeType: element.mimetype,
        size: element.size,
        url: element.location,
      };

      const fileEntity = await this.prismaFileEntityRepository.createOrUpdate(
        file,
      );

      upLoadS3Files.push(fileEntity);
    }
    return upLoadS3Files;
  }

  public async getS3File(key: string) {
    const params = {
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: key,
    };

    return await this.s3.getObject(params).promise();
  }

  public async deleteS3File(key: string) {
    const params = {
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Key: key,
    };
    return await this.s3.deleteObject(params).promise();
  }
}
