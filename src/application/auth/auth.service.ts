import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from '../../infra/prisma/repositories/prisma-user-repository';

@Injectable({})
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private prismaUserRepository: PrismaUserRepository,
  ) {}
  async signup(dto: AuthDto) {
    this.logger.debug('signup(dto: AuthDto)');
    //* generate password hash
    const hash = await argon.hash(dto.password);

    //* save the new user in the db
    const user = await this.prismaUserRepository.create(dto, hash);

    return await this.signToken(user.id, user.email);
  }

  async login(dto: AuthDto) {
    this.logger.debug('login(dto: AuthDto)');
    //* find the user by email

    const user = await this.prismaUserRepository.findByEmail(dto);

    //* if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    //* compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    //* if password incorrect throw execption
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    //* send back the user
    return await this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
