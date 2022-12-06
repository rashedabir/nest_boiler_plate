import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { MediaManagerService } from './media-manager.service';
import { CreateMediaManagerDto } from './dto/create-media-manager.dto';
import { UpdateMediaManagerDto } from './dto/update-media-manager.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/users/guards/jwt.guard';
import LocalFilesInterceptor from 'src/common/interceptors/local-files.interceptor';
import { imageFileFilter } from 'src/engine/utils';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { UserPayload } from 'src/common/decorators/user.payload.decorator';

@ApiTags('Media Manager')
@ApiBearerAuth('jwt')
// GUARDS
@UseGuards(JwtAuthGuard)
@Controller('media-manager')
export class MediaManagerController {
  constructor(private readonly mediaManagerService: MediaManagerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMediaManagerDto,
  })
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/media-manager',
      multi: false,
      limits: 20,
      fileFilter: imageFileFilter,
      size: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
    }),
  )
  async create(
    @UploadedFile() files: Express.Multer.File,
    @UserPayload() userPayload: UserPayloadInterface,
  ) {
    const data = await this.mediaManagerService.create(files, userPayload);

    return { message: 'successful', result: data };
  }

  @Get(':imgpath')
  @ApiParam({
    name: 'imgpath',
    type: String,
    description: 'imgpath',
    required: true,
  })
  async seeUploadedFile(@Param('imgpath') image, @Res() res): Promise<any> {
    const data = await this.mediaManagerService.findOne(image, res);

    return { message: 'Successful', result: data };
  }
}
