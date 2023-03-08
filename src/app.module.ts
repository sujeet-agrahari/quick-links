import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration.yaml';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheEventModule } from './cache/cache-event.module';
import { QuickLinkModule } from './quick-link/quicklink.module';
import { HealthModule } from './health/health.module';
import { HttpCacheInterceptor } from './cache/http-cache.interceptor';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import configurationSchema from './config/configuration.schema';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtGuard } from './auth/guards/jwt-auth.guard';
@Module({
  imports: [
    // register core modules
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: configurationSchema,
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
        port: configService.get('DB_PORT'),
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
        ttl: 30, // seconds
      }),
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
    }),
    CacheEventModule,
    HealthModule,
    ThrottlerModule.forRoot({
      ttl: 60, //seconds
      limit: 30, // 30 calls on an endpoint
    }),

    // register domain modules
    QuickLinkModule,
    UserModule,
    AuthModule,
    RoleModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_GUARD, // implement throttling on all routes, for skipping on any route we will use @SkipThrottle()
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
