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

  @Get('list/service')
  async listService() {
    return await this.catalogService.listService();
  }

  @Get('list/service/updated')
  async listServiceUpdated() {
    return await this.catalogService.listServiceUpdated();
  }

  @Get('list/event/:event')
  async listEvent(@Param('event') event: string) {
    return await this.catalogService.listEvent(event);
  }

  @Get('get/event/:event')
  async getEvent(@Param('event') event: string) {
    return await this.catalogService.getEvent(event);
  }

  @Get('list/event/service/:service')
  async listEventoByServico(@Param('service') service: string) {
    return await this.catalogService.listEventByService(service);
  }
}
