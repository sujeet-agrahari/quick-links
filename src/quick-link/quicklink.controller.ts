import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { QuickLinkService } from './quicklink.service';
import { CreateQuickLinkDto } from './dto/create-quicklink.dto';
import { QuickLinkDto } from './dto/quicklink.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedirectResponseDto } from './dto/redirect-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/guards/public.guard';

@ApiTags('Quick Links')
@Public()
@Controller('quick-links')
export class QuickLinkController {
  constructor(
    private readonly quickLinkService: QuickLinkService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get(':shortLink')
  @SkipThrottle()
  @Redirect()
  async getActualLink(
    @Param('shortLink') shortLink: string,
  ): Promise<RedirectResponseDto> {
    const { actualLink } = await this.quickLinkService.getActualLink(shortLink);
    return { url: actualLink };
  }

  @Post()
  async shortLinks(
    @Body() linkData: CreateQuickLinkDto,
  ): Promise<QuickLinkDto[]> {
    const result = await this.quickLinkService.createNewQuickLink(
      linkData.link,
    );
    /* Deleting the cache for the `/quick-links` endpoint.
     * API shouldn't fail in case of cache deletion failure
     */
    this.eventEmitter.emit('cache.clear', '/quick-links');
    return result;
  }
}
