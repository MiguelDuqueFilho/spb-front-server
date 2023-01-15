import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
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
  constructor(private config: ConfigService, private prisma: PrismaService) {}

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
      try {
        let fileEntity = await this.prisma.fileEntity.findUnique({
          where: {
            key: element.key,
          },
        });

        if (!fileEntity) {
          fileEntity = await this.prisma.fileEntity.create({
            data: file,
          });
        } else {
          fileEntity = await this.prisma.fileEntity.update({
            data: file,
            where: {
              key: element.key,
            },
          });
        }

        upLoadS3Files.push(fileEntity);
      } catch (error) {
        throw new BadRequestException(error);
      }
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
