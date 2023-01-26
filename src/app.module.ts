import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { PrismaModule } from './infra/prisma/prisma.mobule';
import { S3Module } from './infra/s3/s3.module';
import { CatalogModule } from './application/catalog/catalog.module';
import { SchemaModule } from './application/schema/schema.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { NewMessageModule } from './application/new-message/new-message.module';

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
    SchemaModule,
    NewMessageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
