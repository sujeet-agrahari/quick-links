import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleService } from 'src/role/role.service';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *Finds an Auth entity based on the provided email or username.
   *@param email - User email.
   *@returns A Promise that resolves to an Auth entity if one is found.
   * @throws BadRequestException if the user not found
   */
  async findAuthDetailByEmail(email: string): Promise<Auth> {
    const userAuth = await this.authRepository.findOne({
      where: {
        email,
      },
      relations: ['user'],
    });

    return userAuth;
  }

  /**
   * Register a new user with the given credentials.
   * @param createAuthDto - DTO containing the user's credentials.
   * @returns The registered user's auth details.
   * @throws BadRequestException if the user with the given email already exists.
   * @throws BadRequestException if the user role is invalid
   */
  async registerUser(createAuthDto: CreateAuthDto): Promise<Auth> {
    // check if user already exists
    const existingUser = await this.findAuthDetailByEmail(createAuthDto.email);
    if (existingUser) {
      throw new BadRequestException('User already registered, please login!');
    }

    // find the user's role
    const role = await this.roleService.findByRoleName(createAuthDto.role.name);
    if (!role) {
      throw new BadRequestException('Invalid role passed.');
    }

    // set the user's role and create the Auth entity
    createAuthDto.role = role;
    const auth = this.authRepository.create(createAuthDto);

    // save the Auth entity and return it
    return this.authRepository.save(auth);
  }

  async validateUser(email: string, password: string): Promise<Auth> {
    const existingUser = await this.findAuthDetailByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('Account not found');
    }
    if (
      !(await this.passwordService.comparePassword(
        password,
        existingUser.password,
      ))
    ) {
      return null;
    }
    return existingUser;
  }

  async loginUser(userAuth: Auth) {
    const payload = { email: userAuth.email, sub: userAuth.user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
