import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByRoleName(roleName: string): Promise<Role> {
    return this.roleRepository.findOne({
      where: {
        name: roleName,
      },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
