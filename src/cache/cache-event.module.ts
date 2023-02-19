import {
  CACHE_MANAGER,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';

@Module({
  providers: [Logger],
})
export class CacheEventModule implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private eventEmitter: EventEmitter2,
    private logger: Logger,
  ) {}
  onModuleInit() {
    this.eventEmitter.on('cache.clear', async (key: string) => {
      try {
        await this.cacheService.del(key);
      } catch (error) {
        this.logger.log(
          `Failed to clear cache with key: ${key}. Error: ${error.message}`,
        );
      }
    });
    this.eventEmitter.on('cache.add', async ({ key, data, options }) => {
      try {
        await this.cacheService.set(key, data, options);
      } catch (error) {
        this.logger.log(
          `Failed to add cache with key: ${key}. Error: ${error.message}`,
        );
      }
    });
    this.eventEmitter.on('cache.clearAll', async () => {
      try {
        await this.cacheService.reset();
      } catch (error) {
        this.logger.log(`Failed to clear all cache. Error: ${error.message}`);
      }
    });
  }
}
