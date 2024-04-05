import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import {
  repositoryMockFactory,
  MockType,
} from '../../test/__mocks__/repositoryMock';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: MockType<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<MockType<Repository<Role>>>(
      getRepositoryToken(Role),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find role by name', async () => {
    const roleName = 'testRole';
    const role = {
      id: 'fake-uuid',
      name: roleName,
    } as Role;

    roleRepository.findOne.mockReturnValue(Promise.resolve(role));

    const result = await service.findByRoleName(roleName);

    expect(result).toEqual(role);
    expect(roleRepository.findOne).toBeCalledWith({
      where: { name: roleName },
    });
  });
});
