import { PartialType } from '@nestjs/swagger';
import { CreateMediaManagerDto } from './create-media-manager.dto';

export class UpdateMediaManagerDto extends PartialType(CreateMediaManagerDto) {}
