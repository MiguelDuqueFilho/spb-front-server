import { Injectable, Logger } from '@nestjs/common';

import pdfParse from 'pdf-parse';

import { Evento, GrupoServico, Mensagem } from '@prisma/client';

/**
 * * seleciona no pdf o Grupo de Serviço
 */
const regexGrupoServico = /(Grupo de Serviços) ([A-Z]{3}) (?!.)+/g;

/**
 * * seleciona no pdf o O Domínio do Sistema
 */
// const regexDominio =
//   /(Este grupo de serviços pertence ao domínio de sistema) ([A-Z0-9]*)/g;

/**
 * * seleciona Evento
 */
const regexEvento = /Evento ([A-Z]{3}[0-9]{4})( - )([A-za-z0-9\S ]+)/;

/**
 * * seleciona descrição da mensagem
 */
const regexMensagem = /(?<!Código )(Mensagem: )([A-za-z0-9\S ]+)/g;

/**
 * * seleciona Código da mensagem
 */
const regexCodigoMensagem =
  /(Código Mensagem: )([A-Z]{3}[0-9]{4}E{0,1}R{0,1}[ 123]{0,1})( Emissor:)([ A-Za-z0-9á_çãõâ\S]+)([ +]{0,})(Destinatário:)([ A-Za-z0-9á_çãõâ\S]+)/;

/**
 * * seleciona Fluxo do Evento
 */
const regexEventoFluxo =
  /Mensagens Associadas Fluxo do Evento: ([A-za-z0-9\S]+)/g;

let startArqReference = false;
let lineReference = 0;
let cadServicos = [] as GrupoServico[];
let cadEventos = [] as Evento[];
let cadMensagens = [] as Mensagem[];

let cadServico = {} as GrupoServico;
let cadEvento = {} as Evento;
let cadMensagem = {} as Mensagem;

async function ProcessCatalog(line: string, index: number) {
  /**
   * *  get group service
   */
  if (line.match(regexGrupoServico)) {
    const parseText = <string[]>regexGrupoServico.exec(line);
    const [, , GrpServico] = parseText;
    cadServico = { GrpServico } as any;
    lineReference = index + 2;
    startArqReference = true;
    return;
  }

  if (!startArqReference) return;

  /**
   * *  get Service Descricao
   */
  if (lineReference === index) {
    cadServico = {
      ...cadServico,
      Descricao: line,
    };
    cadEvento = { GrpServicoId: cadServico.GrpServico } as any;
    cadServicos = [...cadServicos, cadServico];

    return;
  }

  /**
   * * get Evento
   */
  if (line.match(regexEvento)) {
    const parseText = <string[]>regexEvento.exec(line);
    const [, CodEvento, , NomeEvento] = parseText;
    cadEvento = {
      ...cadEvento,
      CodEvento,
      NomeEvento,
    };
    return;
  }

  /**
   * * get Fluxo
   */
  if (line.match(regexEventoFluxo)) {
    const parseText = <string[]>regexEventoFluxo.exec(line);
    const [, Fluxo] = parseText;
    cadEvento = { ...cadEvento, Fluxo };
    cadEventos = [...cadEventos, cadEvento];
    return;
  }

  /**
   * * get Mensagem
   */
  if (line.match(regexMensagem)) {
    const parseText = <string[]>regexMensagem.exec(line);
    const [, , Descricao] = parseText;
    cadMensagem = { CodEventoId: cadEvento.CodEvento, Descricao } as any;

    return;
  }

  /**
   * * get Cod Mensagem
   */
  if (line.match(regexCodigoMensagem)) {
    const parseText = <string[]>regexCodigoMensagem.exec(line);
    const [, , CodMsg, , EntidadeOrigem, , , EntidadeDestino] = parseText;

    cadMensagem = {
      ...cadMensagem,
      CodMsg,
      Tag: `<${CodMsg.trim()}>`,
      EntidadeOrigem: EntidadeOrigem.trim(),
      EntidadeDestino: EntidadeDestino.trim(),
    };

    cadMensagens = [...cadMensagens, cadMensagem];
  }
}

export interface CatalogGenerateResult {
  info: string;
  author: string;
  pages: number;
  cadServicos: GrupoServico[];
  cadEventos: Evento[];
  cadMensagens: Mensagem[];
}

@Injectable()
export class CatalogGenerate {
  logger = new Logger(CatalogGenerate.name);

  public async execute(
    key: string,
    buffer: Buffer,
  ): Promise<CatalogGenerateResult> {
    this.logger.debug(
      `execute(key: string,buffer: Buffer) Promise<CatalogGenerateResult>`,
    );

    const data = await pdfParse(buffer);

    // process lines
    const lines = data.text.split(/\r?\n/);

    lines.forEach(async (line, index) => {
      /**
       * * ignore line empty fo pdf
       */
      if (line.trim() === '') return;

      await ProcessCatalog(line, index);
    });

    return {
      info: data.info.Title,
      author: data.info.Author,
      pages: data.numpages,
      cadServicos,
      cadEventos,
      cadMensagens,
    };
  }
}
