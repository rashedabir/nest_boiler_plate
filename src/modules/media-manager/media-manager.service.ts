import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { CreateMediaManagerDto } from './dto/create-media-manager.dto';
import { UpdateMediaManagerDto } from './dto/update-media-manager.dto';
import { MediaManagerRepository } from './repository/media-manager.repository';

@Injectable()
export class MediaManagerService {
  constructor(
    @InjectRepository(MediaManagerRepository)
    private mediaManagerRepository: MediaManagerRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(file: any, userPayload: UserPayloadInterface) {
    const fileReponse = {
      url: `${this.configService.get('IMAGE_BASE')}/api/media-manager/${
        file.filename
      }`,
      name: file.filename,
      mimetype: file.mimetype,
      userId: userPayload.id,
    };
    const data = await this.mediaManagerRepository.save(fileReponse);

    return data;
  }

  findAll() {
    return `This action returns all mediaManager`;
  }

  async findOne(image: any, res: any) {
    const result = res.sendFile(image, {
      root: './uploadedFiles/media-manager',
    });

    console.log({ image });
    return result;
  }

  update(id: number, updateMediaManagerDto: UpdateMediaManagerDto) {
    return `This action updates a #${id} mediaManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} mediaManager`;
  }
}
