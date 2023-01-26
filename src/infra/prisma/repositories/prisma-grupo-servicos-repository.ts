import { ForbiddenException, Logger, Injectable } from '@nestjs/common';
import { GrupoServico, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaGrupoServicosRepository {
  logger = new Logger(PrismaGrupoServicosRepository.name);

  constructor(private prisma: PrismaService) {}

  async save(grpServicos: GrupoServico[]): Promise<Prisma.BatchPayload> {
    this.logger.debug(
      `save(grpServicos: GrupoServico[]): Promise<Prisma.BatchPayload>`,
    );
    try {
      const result = await this.prisma.grupoServico.createMany({
        data: grpServicos,
        skipDuplicates: true,
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Error createMany');
      } else {
        throw error;
      }
    }
  }

  async listServiceNotUpdated() {
    this.logger.debug(`listAll()`);
    const result = await this.prisma.grupoServico.findMany({
      include: {
        _count: {
          select: {
            Eventos: {
              where: {
                IsConvert: false,
              },
            },
          },
        },
      },
      orderBy: {
        GrpServico: 'asc',
      },
    });
    return result;
  }
  async listServiceUpdated() {
    this.logger.debug(`listServicoUpdated()`);
    const result = await this.prisma.grupoServico.findMany({
      include: {
        _count: {
          select: {
            Eventos: {
              where: {
                IsConvert: true,
              },
            },
          },
        },
      },
      orderBy: {
        GrpServico: 'asc',
      },
    });
    return result;
  }

  async listService(service: string) {
    this.logger.debug(`listService(service: string)`);
    const result = await this.prisma.grupoServico.findUnique({
      where: {
        GrpServico: service,
      },
      include: {
        Eventos: {
          select: {
            CodEvento: true,
            NomeEvento: true,
            Fluxo: true,
            IsConvert: true,
            EventJson: true,
          },
        },
      },
    });
    return result;
  }
}
