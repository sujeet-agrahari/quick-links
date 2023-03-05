import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Auth } from './auth.entity';
import { PasswordService } from './password.service';

@Injectable()
export class AuthSubscriber implements EntitySubscriberInterface<Auth> {
  constructor(
    datasource: DataSource,
    private readonly passwordService: PasswordService,
  ) {
    datasource.subscribers.push(this);
  }
  listenTo() {
    return Auth;
  }

  async beforeInsert(event: InsertEvent<Auth>): Promise<void> {
    if (event.entity.password) {
      event.entity.password = await this.passwordService.generateHash(
        event.entity.password,
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<Auth>): Promise<void> {
    if (event.entity.password) {
      event.entity.password = await this.passwordService.generateHash(
        event.entity.password,
      );
    }
  }
}
