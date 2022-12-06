import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaManagerDto {
  //   @ApiProperty({
  //     type: 'array',
  //     items: {
  //       type: 'file',
  //       items: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   })
  //   file: any[];

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
