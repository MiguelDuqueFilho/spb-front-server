import { Injectable, Logger } from '@nestjs/common';
import { PrismaEventosRepository } from '../../infra/prisma/repositories/prisma-eventos-repository';
import { PrismaMensagensRepository } from '../../infra/prisma/repositories/prisma-mensagens-repository';
import { PrismaGrupoServicosRepository } from '../../infra/prisma/repositories/prisma-grupo-servicos-repository';
import { S3Service } from '../../infra/s3/s3.service';
import { CatalogGenerate } from './catalog.generate';
import { PrismaFileEntityRepository } from '../../infra/prisma/repositories/prisma-fileEntity-repository';

@Injectable()
export class CatalogService {
  logger = new Logger(CatalogService.name);

  constructor(
    private readonly prismaFileEntityRepository: PrismaFileEntityRepository,
    private readonly s3Service: S3Service,
    private readonly catalogGenerate: CatalogGenerate,
    private readonly prismaGrupoServicosRepository: PrismaGrupoServicosRepository,
    private readonly prismaEventosRepository: PrismaEventosRepository,
    private readonly prismaMensagensRepository: PrismaMensagensRepository,
  ) {}

  public async generate(key: string) {
    this.logger.debug('generate(key: string)');

    const file = await this.s3Service.getS3FileCatalog(key);

    const buffer = file.Body as Buffer;

    const resultGenerate = await this.catalogGenerate.execute(key, buffer);

    const resultServices = await this.prismaGrupoServicosRepository.save(
      resultGenerate.cadServicos,
    );

    const resultEvents = await this.prismaEventosRepository.save(
      resultGenerate.cadEventos,
    );

    const resultMessages = await this.prismaMensagensRepository.save(
      resultGenerate.cadMensagens,
    );

    delete resultGenerate.cadServicos;
    delete resultGenerate.cadEventos;
    delete resultGenerate.cadMensagens;

    return { ...resultGenerate, resultServices, resultEvents, resultMessages };
  }

  async listAll() {
    this.logger.debug('listAll()');
    return await this.prismaFileEntityRepository.findAll();
  }

  async listService() {
    this.logger.debug('listService()');
    return await this.prismaGrupoServicosRepository.listServiceNotUpdated();
  }

  async listServiceUpdated() {
    this.logger.debug('listServiceUpdated()');
    return await this.prismaGrupoServicosRepository.listServiceUpdated();
  }

  async getEvent(event: string) {
    this.logger.debug('getEvent(event)');
    return await this.prismaEventosRepository.getEvent(event);
  }

  async listEvent(event: string) {
    this.logger.debug('listEvent(event)');
    return await this.prismaEventosRepository.list(event);
  }

  async listEventByService(service: string) {
    this.logger.debug('listEventByService(event)');
    return await this.prismaEventosRepository.listByService(service);
  }
}
