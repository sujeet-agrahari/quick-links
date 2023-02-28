import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class IncomingLinksDto {
  @ApiProperty({
    description: 'An array of links to shorten',
  })
  @IsUrl({}, { each: true })
  links: string[];
}
