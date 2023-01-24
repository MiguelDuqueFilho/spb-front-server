import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

// @UseGuards(JwtGuard)
@Controller('catalog')
@ApiTags('catalog')
export class CatalogController {
  logger = new Logger(CatalogController.name);
  constructor(private readonly catalogService: CatalogService) {}

  @Get('generate/:key')
  async generateCatalog(@Param('key') key: string) {
    this.logger.debug('generateCatalog(@Param(key) key: string)');
    return await this.catalogService.generate(key);
  }

  @Get('list')
  async listAll() {
    this.logger.debug('listAll() ');
    return await this.catalogService.listAll();
  }
}
