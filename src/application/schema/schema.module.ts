import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { SchemaCompactJson } from './schema.compact.json';
import { SchemaComplete } from './schema.complete';
import { SchemaTransform } from './schema.transform';
import { PrismaEventosRepository } from '../../infra/prisma/repositories/prisma-eventos-repository';
import { PrismaGrupoServicosRepository } from '../../infra/prisma/repositories/prisma-grupo-servicos-repository';

@Module({
  controllers: [SchemaController],
  providers: [
    SchemaService,
    SchemaCompactJson,
    SchemaComplete,
    SchemaTransform,
    PrismaGrupoServicosRepository,
    PrismaEventosRepository,
  ],
})
export class SchemaModule {}
