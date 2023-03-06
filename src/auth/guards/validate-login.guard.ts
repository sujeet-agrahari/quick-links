// Because guards are called before pipe, we have no choice but to validate login details using guards and don't use validation pipes

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

export class ValidateLoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const validatorInstance = plainToClass(LoginDto, request.body);
    const errors = await validate(validatorInstance);
    if (errors.length > 0) {
      throw new BadRequestException(this.extractErrorMessages(errors));
    }
    // If input is valid, allow request to continue to authentication guard
    return true;
  }

  private extractErrorMessages(errors: ValidationError[]): string[] {
    return errors
      ? errors.flatMap((error) => Object.values(error.constraints))
      : [];
  }
}
