import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  LoadEvent,
  Repository,
} from 'typeorm';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLink } from './quicklink.entity';

@Injectable()
export class QuickLinkSubscriber
  implements EntitySubscriberInterface<QuickLink>
{
  constructor(
    datasource: DataSource,
    @Inject(Base62Encoder) private readonly base62Encoder: Base62Encoder,
    @InjectRepository(QuickLink)
    private readonly quickLinkRepository: Repository<QuickLink>,
  ) {
    datasource.subscribers.push(this);
  }

  listenTo() {
    return QuickLink;
  }

  afterLoad(
    entity: QuickLink,
    event?: LoadEvent<QuickLink>,
  ): void | Promise<any> {
    event.entity.redirectLink = `https://quicklinks.com/${entity.shortLink}`;
  }
}
