import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'node:path';
import { S3Service } from './s3.service';

const pngFileFilter = (req: any, file: any, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

@Controller('api/s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload/catalog')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      fileFilter: pngFileFilter,
    }),
  )
  async uploadFileS3Catalog(
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    return await this.s3Service.uploadS3Files(files);
  }
}
