import { Module } from '@nestjs/common';
import { QuickLinkController } from './quicklink.controller';
import { QuickLinkService } from './quicklink.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickLink } from './quicklink.entity';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLinkSubscriber } from './quicklink.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'quicklink',
      entities: [QuickLink],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([QuickLink]),
  ],
  controllers: [QuickLinkController],
  providers: [QuickLinkService, Base62Encoder, QuickLinkSubscriber],
})
export class QuickLinkModule {}
