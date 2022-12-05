import { Injectable } from '@nestjs/common';
import { FilterDataDto } from 'src/common/dtos/filter-data.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { Brackets } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CatEntity } from './entities/cat.entity';
import { CatRepository } from './repository/cat.repository';

@Injectable()
export class CatService {
  constructor(private readonly catRepository: CatRepository) {}
  async create(createCatDto: CreateCatDto, userPayload: UserPayloadInterface) {
    createCatDto['userId'] = userPayload.id;

    const data = await this.catRepository.save(createCatDto);

    return data;
  }

  async findAll(
    filterDataDto: FilterDataDto,
    userPayload: UserPayloadInterface,
  ): Promise<Pagination<any>> {
    const limit = filterDataDto.pageSize ? filterDataDto.pageSize : 10;
    const page = filterDataDto.pageNumber
      ? filterDataDto.pageNumber == 1
        ? 0
        : filterDataDto.pageNumber
      : 1;

    const [result, total] = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.user', 'user')
      .where('cat.user = :user', { user: userPayload.id })
      .andWhere(
        new Brackets((qb) => {
          if (
            filterDataDto.filter &&
            Object.keys(filterDataDto.filter).length > 0
          ) {
            Object.keys(filterDataDto.filter).forEach(function (key) {
              if (filterDataDto.filter[key] !== '') {
                if (key === 'name') {
                  qb.andWhere(`cat.${key} = '${filterDataDto.filter[key]}'`);
                } else if (key === 'id') {
                  qb.andWhere(`cat.${key} = '${filterDataDto.filter[key]}'`);
                } else {
                  qb.andWhere(
                    `CAST(cat.${key} as VARCHAR) ILIKE ('%${filterDataDto.filter[key]}%')`,
                  );
                }
              }
            });
          }
        }),
      )
      .orderBy(`cat.${filterDataDto.sortField}`, filterDataDto.sortOrder)
      .take(limit)
      .skip(page > 0 ? page * limit - limit : page)
      .select(['cat', 'user.id', 'user.email'])
      .getManyAndCount();

    return new Pagination<any>({
      results: result,
      total,
      currentPage: page === 0 ? 1 : page,
      limit,
    });
  }

  async findOne(id: number) {
    const data = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.user', 'user')
      .where('cat.id = :id', { id: id })
      .select(['cat', 'user.id', 'user.email'])
      .getOne();

    return data;
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
    userPayload: UserPayloadInterface,
  ) {
    updateCatDto['userId'] = userPayload.id;

    const data = await this.catRepository
      .createQueryBuilder('cat')
      .update(CatEntity)
      .set(updateCatDto)
      .where('cat.id = :id AND cat.userId = :userId', {
        id: id,
        userId: userPayload.id,
      })
      .execute();

    return data.affected > 0 ? 'Raw Updated' : 'Something went wrong';
  }

  async remove(id: number, userPayload: UserPayloadInterface) {
    const data = await this.catRepository
      .createQueryBuilder('cat')
      .delete()
      .from(CatEntity)
      .where('cat.id = :id AND cat.userId = :userId', {
        id: id,
        userId: userPayload.id,
      })
      .execute();

    return data.affected > 0 ? 'Raw Deleted' : 'Something went wrong';
  }
}
