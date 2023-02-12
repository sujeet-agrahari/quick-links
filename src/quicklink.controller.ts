import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuickLinkService } from './quicklink.service';
import { IncomingLinksDto } from './dto/incoming-links.dto';
import { QuickLinkDto } from './dto/quicklink.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Quick Link')
@Controller('quick-links')
export class QuickLinkController {
  constructor(private readonly quickLinkService: QuickLinkService) {}

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
    return this.quickLinkService.createNewQuickLinks(linkData.links);
  }
}
