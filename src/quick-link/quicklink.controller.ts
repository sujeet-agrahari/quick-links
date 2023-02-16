import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { QuickLinkService } from './quicklink.service';
import { IncomingLinksDto } from './dto/incoming-links.dto';
import { QuickLinkDto } from './dto/quicklink.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Quick Link')
@Controller('quick-links')
export class QuickLinkController {
  constructor(
    private readonly quickLinkService: QuickLinkService,
    @Inject(CACHE_MANAGER) private cacheManagerService: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get actual link by shortLink' })
  @ApiQuery({ name: 'shortLink', required: false })
  async getActualLink(
    @Query('shortLink') shortLink: string,
  ): Promise<QuickLinkDto | Array<QuickLinkDto>> {
    if (!shortLink) {
      return this.quickLinkService.getLinks();
    }
    return this.quickLinkService.getActualLink(shortLink);
  }

  @Post()
  @ApiOperation({ summary: 'Get quicks links for passed links' })
  @ApiBody({ type: IncomingLinksDto })
  async shortLinks(
    @Body() linkData: IncomingLinksDto,
  ): Promise<QuickLinkDto[]> {
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
