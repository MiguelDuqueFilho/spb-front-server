import { Logger } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';
import { xml2js } from 'xml-js';

/**
 * Function to change Element Name delete xs: ans cat:
 * @param value  elementName
 * @param parentElement
 * @returns
 */
const elementNameFn = (value: string) => {
  return value.replace(/xs:|cat:/gi, '');
};

/**
 * Attributes Fn
 * @param value
 * @param parentElement
 * @returns
 */
const attributesFn = (value: object) => {
  let modelo = value;

  const { xmlns } = value as any;
  if (xmlns) {
    modelo = { xmlns };
  }

  const { name, type, base } = value as any;

  switch (base) {
    case 'xs:string': {
      modelo = { ...modelo, tagRef: 'InputXsString' };
      break;
    }
    case 'xs:integer': {
      modelo = { ...modelo, tagRef: 'InputXsInteger' };
      break;
    }
    case 'xs:decimal': {
      modelo = { ...modelo, tagRef: 'InputXsDecimal' };
      break;
    }
  }

  // eslint-disable-next-line default-case
  switch (name) {
    case 'BCMSG': {
      modelo = {
        ...modelo,
        description: 'Segmento de Controle',
        tagRef: 'BCMSG',
      };
      break;
    }
    case 'Grupo_Seq': {
      modelo = {
        ...modelo,
        NomeCampo: 'Grupo Sequencia',
      };
      break;
    }
    case 'SISMSG': {
      modelo = {
        ...modelo,
        description: 'Segmento do Sistema',
        tagRef: 'SISMSG',
      };
      break;
    }
    case 'USERMSG': {
      modelo = {
        ...modelo,
        description: 'Segmento de Usuário',
      };
      break;
    }
    case 'IdentdEmissor': {
      modelo = {
        ...modelo,
        NomeCampo: 'Identificador Emissor',
        DescricaoCampo:
          'Número de Identificação do emissor junto ao Bacen para o Sistema de pagamentos Brasileiro.',
      };
      break;
    }
    case 'IdentdDestinatario': {
      modelo = {
        ...modelo,
        NomeCampo: 'Identificador Destinatário',
        DescricaoCampo:
          'Número de identificação do destinatário junto ao BACEN para o Sistema de Pagamentos Brasileiro.',
      };
      break;
    }
    case 'IdentdContg': {
      modelo = {
        ...modelo,
        NomeCampo: 'Identificador Contingência',
        DescricaoCampo:
          'Número de identificação do participante em contingência.',
      };
      break;
    }
    case 'IdentdOperad': {
      modelo = {
        ...modelo,
        NomeCampo: 'Identificador Operador',
        DescricaoCampo: 'Identificador pessoal do operador.',
      };
      break;
    }
    case 'IdentdOperadConfc': {
      modelo = {
        ...modelo,
        NomeCampo: 'Identificador Operador Confirmação',
        DescricaoCampo: 'Identificador pessoal do operador da confirmação.',
      };
      break;
    }
    case 'DomSist': {
      modelo = {
        ...modelo,
        NomeCampo: 'Domínio Sistema',
        DescricaoCampo: 'Domínio de sistema.',
      };
      break;
    }
    case 'NUOp': {
      modelo = {
        ...modelo,
        NomeCampo: 'Número_Único Operação',
        DescricaoCampo: 'Número único da operação',
      };
      break;
    }
    case 'NumSeq': {
      modelo = {
        ...modelo,
        NomeCampo: 'Número Sequência',
        DescricaoCampo:
          'Número Sequencial que indica a ordem das mensagens particionadas',
      };
      break;
    }
    case 'IndrCont': {
      modelo = {
        ...modelo,
        NomeCampo: 'Indicador Continuação',
        DescricaoCampo: 'Indicador de continuação',
      };
      break;
    }
  }

  if (name) {
    const GroupType: string = name;
    if (GroupType.includes('Grupo_', 0)) {
      modelo = { ...modelo, tagRef: 'Group' };
    }
    // if (GroupType.includes('ComplexType', 0)) {
    //   modelo = { ...modelo, tagRef: 'Complex' };
    // }
    // if (GroupType.includes('SimpleType', 0)) {
    //   modelo = { ...modelo, tagRef: 'Simplex' };
    // }
  }

  /**
   *  Add Tag ReactComponent to type atrribute
   */

  // eslint-disable-next-line default-case
  switch (type) {
    case 'xs:date': {
      modelo = { ...modelo, tagRef: 'InputXsDate' };
      break;
    }
    case 'xs:dateTime': {
      modelo = { ...modelo, tagRef: 'InputXsDateTime' };
      break;
    }
  }

  if (type) {
    const itemType: string = type;
    if (itemType.includes('ComplexType', 0)) {
      modelo = { ...modelo, childRef: 'complexType' };
    } else if (itemType.includes('SimpleType', 0)) {
      modelo = { ...modelo, childRef: 'simpleType' };
    } else if (!itemType.includes('xs:', 0)) {
      modelo = { ...modelo, childRef: 'simpleType' };
    }
  }

  /**
   *  Add Tag ReactComponent to base atrribute
   */

  // const { element } = value as any;
  // if (element) {
  //   modelo = { ...modelo, tagRef: 'element' };
  // }

  return { ...modelo };
};

const options = {
  /**
   * keep compact = false for sequence correct
   */
  compact: false,
  space: 0,

  /**
   * ignoreOptions
   */

  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreAttributes: false,
  ignoreComment: true,
  ignoreText: false,

  /**
   * interface IgnoreOptions
   */
  // interface
  identAttributes: true,
  nativeType: true,
  nativeTypeAttributes: true,
  alwaysArray: false,
  instructionHasAttributes: true,
  Children: false,
  alwaysChildren: true,
  trim: true,
  ignoreDoctype: true,

  /**
   * Changing Key Names
   */

  declarationKey: 'declaration',
  attributesKey: 'attributes',
  textKey: 'text',
  parentKey: 'parent',

  /**
   * functions
   */
  elementNameFn,
  attributesFn,
};

export class SchemaTransform {
  logger = new Logger(SchemaTransform.name);

  async execute(event: string) {
    let xsd = '';
    const serviceDomain = event.substring(0, 3);

    const schemaPathXsd = path.resolve(
      'xsddoc',
      serviceDomain.toUpperCase(),
      `${event.toUpperCase()}.XSD`,
    );

    try {
      xsd = await fs.readFile(schemaPathXsd, 'latin1');
    } catch (error) {
      this.logger.error(
        `Error readFile do xsd da mensagem: ${event} Error: ${error}.`,
      );
    }

    try {
      const result = xml2js(xsd, options as any);
      return result;
    } catch (error) {
      this.logger.error(
        `Error na transformação do xml fase xml2js da mensagem: ${event} Error: ${error}.`,
      );
      throw new Error(
        `Error na transformação do xml fase xml2js da mensagem: ${event} Error: ${error}.`,
      );
    }
  }
}
