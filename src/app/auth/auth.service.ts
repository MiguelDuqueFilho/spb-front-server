import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}
  async signup(dto: AuthDto) {
    //* generate password hash
    const hash = await argon.hash(dto.password);

    //* save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return await this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        } else {
          throw error;
        }
      }
    }
  }

  async login(dto: AuthDto) {
    //* find the user by email

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

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