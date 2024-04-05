import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Base62Encoder } from './base62-encoder.provider';
import { QuickLink } from './quicklink.entity';

@Injectable()
export class QuickLinkService {
  constructor(
    @InjectRepository(QuickLink)
    private readonly quickLinkRepository: Repository<QuickLink>,
    @Inject(Base62Encoder)
    private readonly base62Encoder: Base62Encoder,
  ) {}
  /**
   * It returns a promise that resolves to an array of QuickLink objects
   * @returns An array of QuickLink objects
   */
  async getLinks(): Promise<Array<QuickLink>> {
    return this.quickLinkRepository.find();
  }
  /**
   * It takes an array of links, encodes them, finds the existing links, filters the new links, saves the
   * new links, and returns the new and existing links
   * @param {string[]} links - string[] - The original links that the user entered
   * @returns An array of QuickLink objects.
   */

  async createNewQuickLink(link: string): Promise<QuickLink[]> {
    const encodedLink = await this.base62Encoder.encode(link);
    const quickLink = [
      {
        actualLink: link,
        shortLink: encodedLink,
      },
    ];
    return this.quickLinkRepository.save(quickLink);
  }

  /**
   * It takes a short link, finds the corresponding quick link in the database, and returns it
   * @param {string} shortLink - string - The short link that we want to find the actual link for.
   * @returns The actual link
   */
  async getActualLink(shortLink: string): Promise<QuickLink> {
    const foundLink = await this.quickLinkRepository.findOne({
      where: {
        shortLink: shortLink,
      },
    });
    if (!foundLink) {
      throw new NotFoundException(`No actual link found for ${shortLink}`);
    }
    return foundLink;
  }

  async createUserQuickLinks(
    userId: string,
    links: string[],
  ): Promise<QuickLink[]> {
    const encodedLinks = await this.base62Encoder.encodeLinks(links);

    const quickLinks = links.map((link, index) => ({
      actualLink: link,
      shortLink: encodedLinks[index],
      userId,
    }));

    return this.quickLinkRepository.save(quickLinks);
  }
}
