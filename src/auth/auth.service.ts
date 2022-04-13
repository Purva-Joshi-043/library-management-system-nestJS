import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './strategy/jwt-payload.interface';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signup(createUserDto: CreateUserDto): Promise<void> {
    return this.usersRepository.createUser(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({
      email: email.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email:email.toLowerCase() };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateProfile(updateUserDto: UpdateUserDto,user:User): Promise<User> {
    
    const { name, address } = updateUserDto;

    if (name) {
      user.name = name;
    }
    if (address) {
      user.address = address;
    }

    await this.usersRepository.save(user);
    return user;
  }

  async updateUserRole(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const { role } = updateUserRoleDto;
    if (role) {
      user.role = role;
    }
    await this.usersRepository.save(user);
  }
}
