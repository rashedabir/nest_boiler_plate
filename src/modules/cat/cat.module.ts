import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatEntity } from './entities/cat.entity';
import { CatRepository } from './repository/cat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity])],
  controllers: [CatController],
  providers: [CatService, CatRepository],
})
export class CatModule {}
