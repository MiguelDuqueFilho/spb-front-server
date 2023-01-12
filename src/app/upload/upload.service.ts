import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async uploadFile(files: Express.MulterS3.File) {
    // const uploadfiles = [];
    // for (const element of files) {
    //   const file = {
    //     originalName = element.originalname;
    //     encoding = element.encoding;
    //     mimeType = element.mimetype;
    //     size = element.size;
    //     url = element.location;
    //   }
    //   uploadfiles.push(file);
    // }
    console.log(files);
    try {
      // return { data: await this.UploadFileRepository.save(uploadfiles) };
      return files;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  // async uploadFile(dataBuffer: Buffer[], fileName: string) {
  //   const uploadResult = await this.client
  //     .upload({
  //       Bucket: this.config.get('AWS_BUCKET_NAME'),
  //       Body: dataBuffer,
  //       Key: `${randomUUID()}-${fileName}`,
  //     })
  //     .promise();

  //   const fileStorageInDB = {
  //     fileName: fileName,
  //     fileUrl: uploadResult.Location,
  //     key: uploadResult.Key,
  //   };

  //   const filestored = await this.prisma.fileEntity.create({
  //     data: fileStorageInDB,
  //   });

  //   return filestored;
  // }

  // public async getFile(key: string) {
  //   const params = {
  //     Bucket: this.config.get('AWS_BUCKET_NAME'),
  //     Key: key,
  //   };
  //   return await this.client.getObject(params).promise();
  // }

  // public async deleteFile(key: string) {
  //   const params = {
  //     Bucket: this.config.get('AWS_BUCKET_NAME'),
  //     Key: key,
  //   };
  //   return await this.client.deleteObject(params).promise();
  // }
}
