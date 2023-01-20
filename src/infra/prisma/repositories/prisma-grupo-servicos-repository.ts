import { ForbiddenException, Logger } from '@nestjs/common';
import { GrupoServico, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma.service';

export class PrismaGrupoServicosRepository {
  logger = new Logger(PrismaGrupoServicosRepository.name);
  constructor(private prisma: PrismaService) {}

  async save(grpServicos: GrupoServico[]): Promise<Prisma.BatchPayload> {
    this.logger.debug(`save(grpServicos: ${grpServicos})`);
    this.logger.debug(this.prisma);

    try {
      const result = await this.prisma.grupoServico.createMany({
        data: grpServicos,
        skipDuplicates: true,
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('xxxxxxxx error');
      } else {
        throw error;
      }
    }
  }

  async listAll() {
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
  async listAllConverted() {
    this.logger.debug(`listAllConverted()`);
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
    this.logger.debug(`listService(service: ${service})`);
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
