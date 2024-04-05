import { Type } from 'class-transformer';
import { IsEmail, IsString, Matches, ValidateNested } from 'class-validator';
import { CreateRoleDto } from '../../role/dto/create-role.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateAuthDto {
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => CreateRoleDto)
  role: CreateRoleDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
