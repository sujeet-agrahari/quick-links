import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { QuickLinkService } from './quicklink.service';
import { IncomingLinksDto } from './dto/incoming-links.dto';
import { QuickLinkDto } from './dto/quicklink.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedirectResponseDto } from './dto/redirect-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('quick-links')
@Controller('quick-links')
export class QuickLinkController {
  constructor(
    private readonly quickLinkService: QuickLinkService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getLinks(): Promise<QuickLinkDto[]> {
    return this.quickLinkService.getLinks();
  }

  @Get(':shortLink')
  @Redirect()
  async getActualLink(
    @Param('shortLink') shortLink: string,
  ): Promise<RedirectResponseDto> {
    const { actualLink } = await this.quickLinkService.getActualLink(shortLink);
    return { url: actualLink };
  }

  @Post()
  async shortLinks(
    @Body() linkData: IncomingLinksDto,
  ): Promise<QuickLinkDto[]> {
    console.log(linkData);
    const result = await this.quickLinkService.createNewQuickLinks(
      linkData.links,
    );
    /* Deleting the cache for the `/quick-links` endpoint.
     * API shouldn't fail in case of cache deletion failure
     */
    this.eventEmitter.emit('cache.clear', '/quick-links');
    return result;
  }
}
