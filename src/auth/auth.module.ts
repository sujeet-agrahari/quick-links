import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { Role } from '../role/role.entity';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Role]),
    RoleModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: configService.get('JWT_SIGN_OPTION'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
