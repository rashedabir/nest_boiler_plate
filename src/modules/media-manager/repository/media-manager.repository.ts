import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MediaManagerEntity } from '../entities/media-manager.entity';

@Injectable()
export class MediaManagerRepository extends Repository<MediaManagerEntity> {
  constructor(private dataSource: DataSource) {
    super(MediaManagerEntity, dataSource.createEntityManager());
  }
}
