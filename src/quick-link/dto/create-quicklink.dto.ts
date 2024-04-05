import { IsUrl } from 'class-validator';

// DTO for creating a single quick link
export class CreateQuickLinkDto {
  @IsUrl()
  link: string;
}
