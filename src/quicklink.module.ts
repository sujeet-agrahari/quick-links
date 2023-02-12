import { Module } from '@nestjs/common';
import { QuickLinkController } from './quicklink.controller';
import { QuickLinkService } from './quicklink.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickLink } from './quicklink.entity';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLinkSubscriber } from './quicklink.subscriber';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.yaml';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [QuickLink],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([QuickLink]),
  ],
  controllers: [QuickLinkController],
  providers: [QuickLinkService, Base62Encoder, QuickLinkSubscriber],
})
export class QuickLinkModule {}
