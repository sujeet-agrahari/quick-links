import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { CreateQuickLinksDto } from 'src/quick-link/dto/create-quicklinks.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId/quick-links')
  async getUserQuickLinks(
    @Request() { user }: AuthenticatedRequest,
  ): Promise<User[]> {
    return this.userService.getUserQuickLinks(user.id);
  }

  @Post('/:userId/quick-links')
  async createUserQuickLinks(
    @Request() { user }: AuthenticatedRequest,
    @Body() { links }: CreateQuickLinksDto,
  ) {
    return this.userService.createUserQuickLinks(user.id, { links });
  }
}
