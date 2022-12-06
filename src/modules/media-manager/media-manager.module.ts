import { Module } from '@nestjs/common';
import { MediaManagerService } from './media-manager.service';
import { MediaManagerController } from './media-manager.controller';
import { MediaManagerRepository } from './repository/media-manager.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaManagerEntity } from './entities/media-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaManagerEntity])],
  controllers: [MediaManagerController],
  providers: [MediaManagerService, MediaManagerRepository],
})
export class MediaManagerModule {}
