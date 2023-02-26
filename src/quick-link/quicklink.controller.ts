import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { QuickLinkService } from './quicklink.service';
import { IncomingLinksDto } from './dto/incoming-links.dto';
import { QuickLinkDto } from './dto/quicklink.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedirectResponseDto } from './dto/redirect-response.dto';

@ApiTags('Quick Link')
@Controller('quick-links')
export class QuickLinkController {
  constructor(
    private readonly quickLinkService: QuickLinkService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all links' })
  async getLinks(): Promise<QuickLinkDto[]> {
    return this.quickLinkService.getLinks();
  }

  @Get(':shortLink')
  @Redirect()
  @ApiOperation({ summary: 'Redirect on actual link' })
  async getActualLink(
    @Param('shortLink') shortLink: string,
  ): Promise<RedirectResponseDto> {
    const { actualLink } = await this.quickLinkService.getActualLink(shortLink);
    return { url: actualLink };
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
