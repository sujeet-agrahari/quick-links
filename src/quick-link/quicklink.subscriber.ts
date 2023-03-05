import { Injectable } from '@nestjs/common';
import { DataSource, EntitySubscriberInterface, LoadEvent } from 'typeorm';
import { QuickLink } from './quicklink.entity';

@Injectable()
export class QuickLinkSubscriber
  implements EntitySubscriberInterface<QuickLink>
{
  constructor(datasource: DataSource) {
    datasource.subscribers.push(this);
  }

  listenTo() {
    return QuickLink;
  }

  afterLoad(
    entity: QuickLink,
    event?: LoadEvent<QuickLink>,
  ): void | Promise<any> {
    event.entity.redirectLink = `http://localhost:3000/${entity.shortLink}`;
  }
}
