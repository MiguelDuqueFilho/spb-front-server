import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

import { XMLValidator } from 'fast-xml-parser';
import rawBody from 'raw-body';

export const XML = createParamDecorator(
  async (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<import('express').Request>();
    if (!req.readable) {
      throw new BadRequestException('Invalid body');
    }

    const body = (await rawBody(req)).toString('utf8').trim();

    const xmlTest = XMLValidator.validate(body);
    if (!xmlTest) {
      return xmlTest;
    }
    return body;
  },
);
