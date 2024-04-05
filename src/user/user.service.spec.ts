import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { QuickLinkService } from '../quick-link/quicklink.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { repositoryMockFactory } from '../../test/__mocks__/repositoryMock';
import { Base62Encoder } from '../quick-link/base62-encoder.provider';
import { QuickLink } from '../quick-link/quicklink.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        QuickLinkService,
        Base62Encoder,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(QuickLink),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
