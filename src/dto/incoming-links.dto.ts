import { IsUrl } from 'class-validator';

export class IncomingLinksDto {
  @IsUrl({}, { each: true })
  links: string[];
}
