import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration.yaml';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheEventModule } from './cache-event/cache-event.module';
import { QuickLinkModule } from './quick-link/quicklink.module';
import { HealthModule } from './health/health.module';
import { HttpCacheInterceptor } from './cache-event/http-cache.interceptor';

@Module({
  imports: [
    // register core modules
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        password: configService.get('DB_PASSWORD'),
        username: configService.get('DB_USER'),
        type: 'postgres',
        port: 5432,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        password: configService.get('REDIS_PASSWORD'),
      }),
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
    }),
    CacheEventModule,
    HealthModule,

    // register domain modules
    QuickLinkModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
