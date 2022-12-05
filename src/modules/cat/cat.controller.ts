import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/common/decorators/user.payload.decorator';
import { FilterDataDto } from 'src/common/dtos/filter-data.dto';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../users/guards/jwt.guard';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@ApiTags('Cat')
@ApiBearerAuth('jwt')
// GUARDS
@UseGuards(JwtAuthGuard)
@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @ApiBody({
    type: CreateCatDto,
  })
  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.catService.create(createCatDto, userPayload);

    return { message: 'successful', result: data };
  }

  @ApiBody({
    type: FilterDataDto,
    description: 'How to create cat?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          filter: {},
          sortOrder: 'ASC || DESC',
          sortField: 'id',
          pageNumber: 1,
          pageSize: 10,
        } as unknown as FilterDataDto,
      },
    },
  })
  @Post('find')
  async findAll(
    @Body() filterDataDto: FilterDataDto,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.catService.findAll(filterDataDto, userPayload);

    return { message: 'successful', result: data };
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.catService.findOne(+id);

    return { message: 'successful', result: data };
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.catService.update(+id, updateCatDto, userPayload);

    return { message: 'successful', result: data };
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.catService.remove(+id, userPayload);

    return { message: 'successful', result: data };
  }
}
