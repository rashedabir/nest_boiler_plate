import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  TypeOrmConnectionName,
  TYPEORM_CONNECTION_NAMES,
} from './constants/typeorm-constants';
import { TypeOrmLoggerContainer } from './logger/typeorm-logger-container';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  static connectionName: TypeOrmConnectionName =
    TYPEORM_CONNECTION_NAMES.DEFAULT;

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: +this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize:
        this.configService.get('APP_ENV') === 'development' ? true : false,
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: false,
      //custom logger implementation
      logger: TypeOrmLoggerContainer.ForConnection(
        TypeOrmConfigService.connectionName,
        this.configService.get('APP_ENV') === 'development' ? true : false,
      ),

      name: TypeOrmConfigService.connectionName,
    };
  }
}
