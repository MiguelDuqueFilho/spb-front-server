import { Injectable, Logger } from '@nestjs/common';

import pdfParse from 'pdf-parse';

import { Evento, GrupoServico, Mensagem } from '@prisma/client';

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

  /**
   * * seleciona no pdf o Grupo de Serviço
   */
  regexGrupoServico = /(Grupo de Serviços) ([A-Z]{3}) (?!.)+/g;

  /**
   * * seleciona Evento
   */
  regexEvento = /Evento ([A-Z]{3}[0-9]{4})( - )([A-za-z0-9\S ]+)/;

  /**
   * * seleciona descrição da mensagem
   */
  regexMensagem = /(?<!Código )(Mensagem: )([A-za-z0-9\S ]+)/g;

  /**
   * * seleciona Código da mensagem
   */
  regexCodigoMensagem =
    /(Código Mensagem: )([A-Z]{3}[0-9]{4}E{0,1}R{0,1}[ 123]{0,1})( Emissor:)([ A-Za-z0-9á_çãõâ\S]+)([ +]{0,})(Destinatário:)([ A-Za-z0-9á_çãõâ\S]+)/;

  /**
   * * seleciona Fluxo do Evento
   */
  regexEventoFluxo = /Mensagens Associadas Fluxo do Evento: ([A-za-z0-9\S]+)/g;

  startArqReference = false;
  lineReference = 0;
  cadServicos = [] as GrupoServico[];
  cadEventos = [] as Evento[];
  cadMensagens = [] as Mensagem[];

  cadServico = {} as GrupoServico;
  cadEvento = {} as Evento;
  cadMensagem = {} as Mensagem;

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

      await this.ProcessCatalog(line, index);
    });

    return {
      info: data.info.Title,
      author: data.info.Author,
      pages: data.numpages,
      cadServicos: this.cadServicos,
      cadEventos: this.cadEventos,
      cadMensagens: this.cadMensagens,
    };
  }

  private async ProcessCatalog(line: string, index: number) {
    /**
     * *  get group service
     */
    if (line.match(this.regexGrupoServico)) {
      const parseText = <string[]>this.regexGrupoServico.exec(line);
      const [, , GrpServico] = parseText;
      this.cadServico = { GrpServico } as any;
      this.lineReference = index + 2;
      this.startArqReference = true;
      return;
    }

    if (!this.startArqReference) return;

    /**
     * *  get Service Descricao
     */
    if (this.lineReference === index) {
      this.cadServico = {
        ...this.cadServico,
        Descricao: line,
      };
      this.cadEvento = { GrpServicoId: this.cadServico.GrpServico } as any;
      this.cadServicos = [...this.cadServicos, this.cadServico];

      return;
    }

    /**
     * * get Evento
     */
    if (line.match(this.regexEvento)) {
      const parseText = <string[]>this.regexEvento.exec(line);
      const [, CodEvento, , NomeEvento] = parseText;
      this.cadEvento = {
        ...this.cadEvento,
        CodEvento,
        NomeEvento,
      };
      return;
    }

    /**
     * * get Fluxo
     */
    if (line.match(this.regexEventoFluxo)) {
      const parseText = <string[]>this.regexEventoFluxo.exec(line);
      const [, Fluxo] = parseText;
      this.cadEvento = { ...this.cadEvento, Fluxo };
      this.cadEventos = [...this.cadEventos, this.cadEvento];
      return;
    }

    /**
     * * get Mensagem
     */
    if (line.match(this.regexMensagem)) {
      const parseText = <string[]>this.regexMensagem.exec(line);
      const [, , Descricao] = parseText;
      this.cadMensagem = {
        CodEventoId: this.cadEvento.CodEvento,
        Descricao,
      } as any;

      return;
    }

    /**
     * * get Cod Mensagem
     */
    if (line.match(this.regexCodigoMensagem)) {
      const parseText = <string[]>this.regexCodigoMensagem.exec(line);
      const [, , CodMsg, , EntidadeOrigem, , , EntidadeDestino] = parseText;

      this.cadMensagem = {
        ...this.cadMensagem,
        CodMsg,
        Tag: `<${CodMsg.trim()}>`,
        EntidadeOrigem: EntidadeOrigem.trim(),
        EntidadeDestino: EntidadeDestino.trim(),
      };

      this.cadMensagens = [...this.cadMensagens, this.cadMensagem];
    }
  }
}
