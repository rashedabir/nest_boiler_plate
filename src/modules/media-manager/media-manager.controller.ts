import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserPayload } from 'src/common/decorators/user.payload.decorator';
import LocalFilesInterceptor from 'src/common/interceptors/local-files.interceptor';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { imageFileFilter } from 'src/engine/utils';
import { JwtAuthGuard } from 'src/modules/users/guards/jwt.guard';
import { CreateMediaManagerDto } from './dto/create-media-manager.dto';
import { MediaManagerService } from './media-manager.service';

@ApiTags('Media Manager')
@Controller('media-manager')
export class MediaManagerController {
  constructor(private readonly mediaManagerService: MediaManagerService) {}

  @ApiBearerAuth('jwt')
  // GUARDS
  @UseGuards(JwtAuthGuard)
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
