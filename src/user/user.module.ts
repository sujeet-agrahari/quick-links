import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QuickLinkModule } from 'src/quick-link/quicklink.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QuickLinkModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
