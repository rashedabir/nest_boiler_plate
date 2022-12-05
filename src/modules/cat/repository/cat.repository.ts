import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CatEntity } from '../entities/cat.entity';

@Injectable()
export class CatRepository extends Repository<CatEntity> {
  constructor(private dataSource: DataSource) {
    super(CatEntity, dataSource.createEntityManager());
  }
}
