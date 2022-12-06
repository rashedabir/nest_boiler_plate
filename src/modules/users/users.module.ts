/**dependencies */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user.entity';
import { UserAuthController } from './users.controller';
import { UserAuthService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { MediaManagerService } from '../media-manager/media-manager.service';
import { MediaManagerRepository } from '../media-manager/repository/media-manager.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    MediaManagerService,
    UserRepository,
    JwtStrategy,
    LocalStrategy,
    MediaManagerRepository,
  ],
})
export class UserAuthModule {}
