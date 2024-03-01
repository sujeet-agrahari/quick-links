import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { RoleService } from '../role/role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import {
  MockType,
  repositoryMockFactory,
} from '../../test/__mocks__/repositoryMock';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: MockType<Repository<Auth>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        PasswordService,
        RoleService,
        {
          provide: getRepositoryToken(Auth),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Role),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<MockType<Repository<Auth>>>(
      getRepositoryToken(Auth),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find auth detail by email', async () => {
    const email = 'test@example.com';
    const authDetail = { id: 'fake-uuid', email } as Auth;

    authRepository.findOne.mockReturnValue(Promise.resolve(authDetail));

    const result = await service.findAuthDetailByEmail(email);

    expect(result).toEqual(authDetail);
    expect(authRepository.findOne).toBeCalledWith({
      where: { email },
      relations: ['user'],
    });
  });
});
