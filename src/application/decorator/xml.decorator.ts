import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { XMLValidator } from 'fast-xml-parser';
import rawBody from 'raw-body';

export const XML = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<import('express').Request>();

    if (!req.readable) {
      throw new BadRequestException('Invalid body');
    }

    const body = (await rawBody(req))
      .toString('utf8')
      // .replace(/[\n\t]/g, '')
      .trim();

    const xmlTest = XMLValidator.validate(body);

    if (xmlTest !== true) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Xml format error',
          cause: xmlTest.err as any,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return body;
  },
);
