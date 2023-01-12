import {
  Controller,
  FileTypeValidator,
  Logger,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'node:path';
import { UploadService } from './upload.service';

const pngFileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

@Controller('api/upload')
export class UploadController {
  logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @Post('catalog')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      fileFilter: pngFileFilter,
    }),
  )
  async uploadFileSCatalog(
    @UploadedFiles()
    files: Express.MulterS3.File[],
  ) {
    console.log(files);
    // return await this.uploadService.uploadFile(file);
    return { files };
  }
}
