import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigModule } from './config/database/typeorm-config.module';
import { TypeOrmConfigService } from './config/database/typeorm-config.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserAuthModule } from './modules/users/users.module';
import { CatModule } from './modules/cat/cat.module';
import { MulterModule } from '@nestjs/platform-express';
import { MediaManagerModule } from './modules/media-manager/media-manager.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploadedFiles',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [ConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the ConnectionOptions.
      name: TypeOrmConfigService.connectionName,
      useExisting: TypeOrmConfigService,
    }),
    RouterModule.register([
      {
        path: 'auth',
        module: UserAuthModule,
      },
    ]),
    UserAuthModule,
    CatModule,
    MediaManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/auth/', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
