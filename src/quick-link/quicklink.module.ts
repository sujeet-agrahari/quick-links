import { QuickLinkController } from './quicklink.controller';
import { QuickLinkService } from './quicklink.service';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLinkSubscriber } from './quicklink.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickLink } from './quicklink.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([QuickLink])],
  controllers: [QuickLinkController],
  providers: [
    QuickLinkService,
    Base62Encoder,
    QuickLinkSubscriber,
    EventEmitter2,
  ],
  exports: [QuickLinkService],
})
export class QuickLinkModule {}
