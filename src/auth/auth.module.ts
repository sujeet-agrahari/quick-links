import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthSubscriber } from './auth.subscriber';
import { PasswordService } from './password.service';
import { Role } from '../role/role.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Role]), RoleModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, AuthSubscriber],
})
export class AuthModule {}
