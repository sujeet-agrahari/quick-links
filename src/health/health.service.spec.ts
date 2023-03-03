import { CACHE_MANAGER, Logger } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;
  let typeOrm: TypeOrmHealthIndicator;
  let cacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [CacheModule.register()],
      providers: [
        HealthService,
        Logger,
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
    typeOrm = module.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  describe('checkDatabase()', () => {
    it('should return the status of database', async () => {
      const expected: HealthIndicatorResult = {
        database: {
          status: 'up',
        },
      };
      jest.spyOn(typeOrm, 'pingCheck').mockResolvedValue(expected);

      const result = await healthService.checkDatabase();

      expect(result).toEqual(expected);
      expect(typeOrm.pingCheck).toHaveBeenCalledWith('database', {
        timeout: 300,
      });
    });
  });
  describe('checkCache()', () => {
    it('should return the status of cache up', async () => {
      const expected: HealthIndicatorResult = {
        cache: {
          status: 'up',
        },
      };
      jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(['https://example.com']);

      const result = await healthService.checkCache();

      expect(result).toEqual(expected);
    });
    it('should return the status of cache down', async () => {
      const expected: HealthIndicatorResult = {
        cache: {
          status: 'down',
        },
      };
      const cacheError = new Error('Failed to get cache');
      cacheService.get.mockRejectedValue(cacheError);
      const result = await healthService.checkCache();
      console.log(result);
      expect(result).toEqual(expected);
    });
  });

  describe('isHealth()', () => {
    it("Should return quick-links status 'up' when both database and cache are up", async () => {
      const expected: HealthIndicatorResult = {
        'quick-links': {
          status: 'up',
          database: {
            status: 'up',
          },
          cache: {
            status: 'up',
          },
        },
      };
      jest.spyOn(healthService, 'checkDatabase').mockResolvedValue({
        database: {
          status: 'up',
        },
      });
      jest.spyOn(healthService, 'checkCache').mockResolvedValue({
        cache: {
          status: 'up',
        },
      });

      const result = await healthService.isHealthy('quick-links');
      expect(result).toEqual(expected);
    });
    it("Should return quick-links status 'up' when redis is 'down'", async () => {
      const expected: HealthIndicatorResult = {
        'quick-links': {
          status: 'up',
          database: {
            status: 'up',
          },
          cache: {
            status: 'down',
          },
        },
      };
      jest.spyOn(healthService, 'checkDatabase').mockResolvedValue({
        database: {
          status: 'up',
        },
      });
      jest.spyOn(healthService, 'checkCache').mockResolvedValue({
        cache: {
          status: 'down',
        },
      });

      const result = await healthService.isHealthy('quick-links');
      expect(result).toEqual(expected);
    });
    it("Should throw 'HealthCheckError' when database is down", async () => {
      const healthResult = {
        'quick-links': {
          status: 'down',
          database: {
            status: 'down',
          },
          cache: {
            status: 'up',
          },
        },
      };
      const expected = new HealthCheckError(
        'App health check failed',
        healthResult,
      );

      jest.spyOn(healthService, 'checkDatabase').mockResolvedValue({
        database: {
          status: 'down',
        },
      });
      jest.spyOn(healthService, 'checkCache').mockResolvedValue({
        cache: {
          status: 'up',
        },
      });
      expect(healthService.isHealthy('quick-links')).rejects.toThrow(expected);
    });
  });
});
