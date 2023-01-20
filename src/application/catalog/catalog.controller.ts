import { Controller, Get, Logger, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

// @UseGuards(JwtGuard)
@Controller('catalog')
export class CatalogController {
  logger = new Logger(CatalogController.name);
  constructor(private readonly catalogService: CatalogService) {}

  @Get('generate/:key')
  async generateCatalog(@Param('key') key: string) {
    this.logger.debug('generateCatalog(@Param(key) key: string)');
    return await this.catalogService.generate(key);
  }
}
