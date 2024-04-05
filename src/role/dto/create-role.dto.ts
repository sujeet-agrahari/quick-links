import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsIn(['User'])
  name: string;
}
