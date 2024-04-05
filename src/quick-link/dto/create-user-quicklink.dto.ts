import { IsUrl, IsUUID } from 'class-validator';

export class CreateUserQuickLinkDto {
  @IsUUID()
  userId: string;

  @IsUrl({}, { each: true })
  link: string;
}
