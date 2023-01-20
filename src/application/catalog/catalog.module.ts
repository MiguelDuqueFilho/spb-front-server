import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { S3Service } from '../../infra/s3/s3.service';
import { PrismaFileEntityRepository } from '../../infra/prisma/repositories/prisma-fileEntity-repository';
import { PrismaGrupoServicosRepository } from '../../infra/prisma/repositories/prisma-grupo-servicos-repository';
import { PrismaEventosRepository } from '../../infra/prisma/repositories/prisma-eventos-repository';
import { PrismaMensagensRepository } from '../../infra/prisma/repositories/prisma-mensagens-repository';
import { CatalogGenerate } from './catalog.generate';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    CatalogGenerate,
    S3Service,
    PrismaGrupoServicosRepository,
    PrismaEventosRepository,
    PrismaMensagensRepository,
    PrismaFileEntityRepository,
  ],
})
export class CatalogModule {}
