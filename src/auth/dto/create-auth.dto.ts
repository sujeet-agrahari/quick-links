import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateRoleDto } from '../../role/dto/create-role.dto';

export class CreateAuthDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => CreateRoleDto)
  role: CreateRoleDto;
}
