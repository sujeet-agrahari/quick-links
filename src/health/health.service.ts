import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  HealthIndicatorStatus,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Cache } from 'cache-manager';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private typeOrm: TypeOrmHealthIndicator,
  ) {
    super();
  }

  async checkDatabase(): Promise<HealthIndicatorResult> {
    const result = await this.typeOrm.pingCheck('database', {
      timeout: 300,
    });
    return result;
  }

  async checkCache(): Promise<HealthIndicatorResult> {
    try {
      await this.cacheService.get('/quick-links');
      return {
        cache: {
          status: 'up',
        },
      };
    } catch (err) {
      return {
        cache: {
          status: 'down',
        },
      };
    }
  }
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const [databaseResult, cacheResult] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);

    const details = {
      database: databaseResult,
      cache: cacheResult,
    };

    let status: HealthIndicatorStatus = 'up';
    Object.entries(details).forEach(([component, health]) => {
      // app health does not depend on cache
      if (component === 'cache') {
        return true;
      }
      if (health[component].status !== 'up') {
        status = 'down';
      }
    });
    const isHealthy = status === 'up';
    const result = this.getStatus(key, isHealthy, {
      ...databaseResult,
      ...cacheResult,
    });
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('App health check failed', result);
  }
}
