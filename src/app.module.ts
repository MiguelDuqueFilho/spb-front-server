import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { DatabaseModule } from './infra/database/database.mobule';
import { S3Module } from './infra/storage/s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    S3Module,
  ],
})
export class AppModule {}
