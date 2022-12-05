import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
