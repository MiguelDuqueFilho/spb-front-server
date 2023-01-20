import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { PrismaModule } from './infra/prisma/prisma.mobule';
import { S3Module } from './infra/s3/s3.module';
import { CatalogModule } from './application/catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CatalogModule,
    S3Module,
    PrismaModule,
  ],
})
export class AppModule {}
