import { ArrayMaxSize, ArrayMinSize, IsUrl } from 'class-validator';

// DTO for creating multiple quick links
export class CreateQuickLinksDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  links: string[];
}
