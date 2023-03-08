import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuickLinksDto } from 'src/quick-link/dto/create-quicklinks.dto';

import { QuickLinkService } from 'src/quick-link/quicklink.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly quickLinkService: QuickLinkService,
  ) {}
  async findUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getUserQuickLinks(userId: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: userId,
      },
      relations: ['quickLinks'],
    });
  }

  async createUserQuickLinks(userId: string, { links }: CreateQuickLinksDto) {
    return this.quickLinkService.createUserQuickLinks(userId, links);
  }
}
