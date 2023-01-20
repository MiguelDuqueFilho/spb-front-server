import {
  Controller,
  Get,
  Param,
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

// @UseGuards(JwtGuard)
@Controller('s3')
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

  @Get('get/catalog/:key')
  async getCatalog(@Param('key') key: string) {
    const file = await this.s3Service.getS3File(key);

    delete file.Body;
    delete file.Metadata;
    return file;
  }

  @Get('delete/catalog/:key')
  async deleteCatalog(@Param('key') key: string) {
    return await this.s3Service.deleteS3File(key);
  }
}
