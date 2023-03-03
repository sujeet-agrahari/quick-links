import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLink } from './quicklink.entity';
import { QuickLinkService } from './quicklink.service';

/**
 * It creates a mock object that has the same shape as the Repository class, but with all the methods
 * replaced with jest.Mock
 */
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
});
describe('QuickLinkService', () => {
  let quickLinkService: QuickLinkService;
  let quickLinkRepository: MockRepository;

  // setup phase
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuickLinkService,
        {
          provide: getRepositoryToken(QuickLink),
          useValue: createMockRepository(),
        },
        {
          provide: Base62Encoder,
          useValue: {},
        },
      ],
    }).compile();
    quickLinkService = module.get<QuickLinkService>(QuickLinkService);
    quickLinkRepository = module.get<MockRepository>(
      getRepositoryToken(QuickLink),
    );
  });
  it('should be defined', () => {
    expect(quickLinkService).toBeDefined();
  });

  // describe the method
  describe('getActualLink', () => {
    // success path
    describe('when link with passed shortLink exist', () => {
      it('should return quick-link object', async () => {
        const shortLink = 'https://example.com';
        const expectedQuickLink = {};

        quickLinkRepository.findOne.mockReturnValue(expectedQuickLink);
        const quickLink = await quickLinkService.getActualLink(shortLink);
        expect(quickLink).toEqual(expectedQuickLink);
      });
    });

    // failure path
    describe('otherwise', () => {
      it('should throw the "NotFoundException', async () => {
        const shortLink = 'https://example.com';
        quickLinkRepository.findOne.mockReturnValue(undefined);
        try {
          await quickLinkService.getActualLink(shortLink);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`No actual link found for ${shortLink}`);
        }
      });
    });
  });
});
