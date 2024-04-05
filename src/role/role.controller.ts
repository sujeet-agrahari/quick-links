import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }
}
