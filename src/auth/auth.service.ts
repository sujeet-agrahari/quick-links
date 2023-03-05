import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleService } from 'src/role/role.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

interface FindAuthDetailsOptions {
  username?: string;
  email?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly roleService: RoleService,
  ) {}

  /**
   *Finds an Auth entity based on the provided email or username.
   *@param options - An object that can contain either an email or a username property.
   *@returns A Promise that resolves to an Auth entity if one is found, or undefined if not.
   */
  async findAuthDetails(
    options: FindAuthDetailsOptions,
  ): Promise<Auth | undefined> {
    const where: FindOptionsWhere<Auth> = {};

    if (options.email) {
      where.email = options.email;
    }

    if (options.username) {
      where.username = options.username;
    }

    const auth = await this.authRepository.findOne({ where });

    return auth;
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
    const existingUser = await this.findAuthDetails({
      email: createAuthDto.email,
    });
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
}
