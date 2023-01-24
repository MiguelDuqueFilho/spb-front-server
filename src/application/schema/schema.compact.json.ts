import { Logger } from '@nestjs/common';

export class SchemaCompactJson {
  logger = new Logger(SchemaCompactJson.name);
  /**
   * Function transform json schema to compact schema
   * @param buffer schema from xsd em format json
   * @returns
   */
  async execute(buffer: object, event: string) {
    this.logger.debug(`execute(buffer: object, event: ${event})`);
    const objectDoc = await this.compactObject(buffer);
    return objectDoc;
  }

  private async compactObject(
    obj: any,
    stack: any = '',
    prevType = '',
    prevElement = '',
  ): Promise<any> {
    let resultObject: any = [];
    let PrevElementIterate: string = prevElement;
    /**
     * iterate object until the end
     */

    for (const property in obj) {
      if (Array.isArray(obj[property])) {
        this.logger.debug(
          `${prevElement} ${property} (L=${obj[property].length}) is an array  with parent ${prevType} ${stack}`,
        );

        PrevElementIterate = property;
        if (obj[property].length !== 0) {
          const resultObjectlevel = await this.compactObject(
            obj[property],
            `${stack}${property}`,
            'array',
            PrevElementIterate,
          );

          const resultElements = await this.elementsObjects(
            resultObjectlevel,
            // "array",
            // PrevElementIterate
          );

          resultObject = {
            ...resultObject,
            [property]: resultElements,
          };
        }
      } else if (
        typeof obj[property] !== 'string' &&
        typeof obj[property] !== 'number'
      ) {
        if (prevType === 'array') {
          this.logger.debug(
            `${prevElement} ${property} ${stack}[${property}] is an object, item of array ${stack}`,
          );

          const resultObjectlevel = await this.compactObject(
            obj[property],
            `${stack}[${property}].`,
            'object',
            PrevElementIterate,
          );

          const resultObjectOfArray = await this.objectOfArray(
            resultObjectlevel,
            // "object",
            // PrevElementIterate
          );

          resultObject.push(resultObjectOfArray);
        } else {
          this.logger.debug(
            `${prevElement} ${property} ${stack}${property} is ${typeof obj[
              property
            ]} with parent ${prevType} ${stack}`,
          );

          PrevElementIterate = property;

          const resultObjectlevel = await this.compactObject(
            obj[property],
            `${stack}${property}.`,
            'object',
            PrevElementIterate,
          );

          resultObject = { ...resultObject, [property]: resultObjectlevel };
        }
      } else if (prevType === 'array') {
        this.logger.debug(
          `${prevElement} ${property} = ${obj[property]} ${stack}`,
        );
        resultObject = { ...resultObject, [property]: obj[property] };
      } else {
        this.logger.debug(
          `${prevElement} ${property} = ${obj[property]} ${stack}`,
        );
        resultObject = { ...resultObject, [property]: obj[property] };
      }
    }
    return resultObject;
  }

  private async elementsObjects(
    obj: any,
    // prevType = "",
    // prevElement: any = ""
  ): Promise<any> {
    let resultObject: any = [];
    let elementItem: any = [];
    const complexTypeItem: any = [];
    const simpleTypeItem: any = [];

    const { schema } = obj[0];
    if (!schema) return obj;

    const { xmlns, elements } = schema;

    /**
     * Level Down for DOC
     */
    elementItem = elements[0];
    /**
     * Create complex final
     */

    for (const property in elements) {
      const { complexType, simpleType } = elements[property];
      if (complexType) complexTypeItem.push({ ...complexType });
      if (simpleType) simpleTypeItem.push({ ...simpleType });
    }

    resultObject = {
      schema: {
        xmlns,
        element: elementItem,
        complexType: complexTypeItem,
        simpleType: simpleTypeItem,
      },
    };
    return resultObject;
  }

  private async objectOfArray(
    obj: any,
    // prevType = "",
    // prevElement = ""
  ): Promise<any> {
    let resultObject: any = [];

    const { type, name, text, ...rest } = obj;

    switch (type) {
      // type swith
      case 'text': {
        resultObject = { text };
        break;
      }
      case 'element': {
        switch (name) {
          // name swith
          case 'choice':
          case 'sequence': {
            const { attributes, elements } = rest;
            resultObject = { [name]: { ...attributes, element: elements } };

            break;
          }
          case 'schema': {
            const { attributes, ...elements } = rest;

            resultObject = { [name]: { ...attributes, ...elements } };
            break;
          }
          case 'complexType': {
            const { attributes, elements } = rest;
            let elementsCompress: any = {};
            if (elements) {
              for (const x in elements) {
                const { element } = elements[x];
                if (element) {
                  elementsCompress = { ...elementsCompress, ...element };
                } else {
                  elementsCompress = { ...elementsCompress, ...elements[x] };
                }
              }
            }
            resultObject = { [name]: { ...attributes, ...elementsCompress } };
            break;
          }
          case 'simpleType': {
            const { attributes, elements } = rest;
            let elementsCompress: any = {};
            if (elements) {
              for (const x in elements) {
                const { restriction } = elements[x];
                if (restriction) {
                  elementsCompress = { ...elementsCompress, ...restriction };
                } else {
                  elementsCompress = { ...elementsCompress, ...elements[x] };
                }
              }
            }
            resultObject = { [name]: { ...attributes, ...elementsCompress } };
            break;
          }
          case 'element': {
            const { attributes, elements } = rest;

            let elementsCompress: any = {};
            if (elements) {
              for (const x in elements) {
                elementsCompress = { ...elementsCompress, ...elements[x] };
              }
            }

            resultObject = { ...attributes, ...elementsCompress };
            break;
          }
          case 'Observacao':
          case 'DescricaoTipo':
          case 'NomeCampo':
          case 'DescricaoCampo':
          case 'Mensagem':
          case 'Emissor':
          case 'DescricaoRegra':
          case 'CodigoRegra':
          case 'TipoFluxo':
          case 'Servico':
          case 'Descricao':
          case 'Evento': {
            const { elements } = rest;
            resultObject = { [name]: elements[0].text };
            break;
          }
          case 'Destinatario': {
            const { elements } = rest;
            resultObject = { [name]: elements[0].text, tagRef: 'Message' };
            break;
          }
          case 'InfRegra': {
            const { elements } = rest;
            let regras = {};
            for (const r in elements) {
              regras = { ...regras, ...elements[r] };
            }
            resultObject = { [name]: regras };
            break;
          }
          case 'InfEvento': {
            const { elements } = rest;
            let InfEvento = {};
            const infr = [];
            for (const r in elements) {
              const { InfRegra } = elements[r];
              if (InfRegra) {
                infr.push({ ...InfRegra });
              } else {
                InfEvento = { ...InfEvento, ...elements[r] };
              }
            }
            resultObject = { ...InfEvento, tagRef: 'DOC', InfRegra: infr };
            break;
          }
          case 'extension':
          case 'simpleContent':
          case 'InfTipo':
          case 'InfCampo':
          case 'InfMensagem':
          case 'annotation':
          case 'documentation': {
            const { elements } = rest;
            for (const r in elements) {
              resultObject = { ...resultObject, ...elements[r] };
            }
            break;
          }
          case 'restriction': {
            const { attributes, ...elem } = rest;
            const { elements } = elem;
            let restrictionCompress: any = {};
            if (elements) {
              for (const x in elements) {
                restrictionCompress = {
                  ...restrictionCompress,
                  ...elements[x],
                };
              }
              resultObject = {
                [name]: { ...attributes, ...restrictionCompress },
              };
            }
            break;
          }
          case 'attribute': {
            const { attributes } = rest;
            if (attributes) {
              resultObject = {
                [name]: { ...attributes },
              };
            }
            break;
          }
          default: {
            const { attributes } = rest;
            const { value } = attributes;
            resultObject = { [name]: value };
            break;
          }
        }
        break;
      }
      default: {
        this.logger.debug(`error: default for switch não pode ser acionado `);
        resultObject = obj;
        break;
      }
    }

    return resultObject;
  }
}
