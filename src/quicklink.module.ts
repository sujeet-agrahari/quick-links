import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { QuickLinkController } from './quicklink.controller';
import { QuickLinkService } from './quicklink.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickLink } from './quicklink.entity';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLinkSubscriber } from './quicklink.subscriber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.yaml';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
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
        entities: [QuickLink],
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

    TypeOrmModule.forFeature([QuickLink]),
  ],
  controllers: [QuickLinkController],
  providers: [
    QuickLinkService,
    Base62Encoder,
    QuickLinkSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class QuickLinkModule {}
