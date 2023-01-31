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

  async listService() {
    this.logger.debug(`listService()`);
    const result: any[] = [];
    const resultList = await this.prisma.grupoServico.findMany({
      include: {
        Eventos: {
          select: {
            CodEvento: true,
            NomeEvento: true,
            IsConvert: true,
          },
        },
      },
      orderBy: {
        GrpServico: 'asc',
      },
    });

    for (let i = 0; i < resultList.length; i++) {
      let eventsTotal = 0;
      let eventsConverted = 0;
      const { Eventos } = resultList[i];
      for (let ie = 0; ie < Eventos.length; ie++) {
        if (Eventos[ie].IsConvert) {
          eventsConverted += 1;
        }
        eventsTotal += 1;
      }
      result[i] = {
        GrpServico: resultList[i].GrpServico,
        Description: resultList[i].Descricao,
        eventsTotal,
        eventsConverted,
      };
    }
    return result;
  }

  async listServiceId(service: string) {
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
