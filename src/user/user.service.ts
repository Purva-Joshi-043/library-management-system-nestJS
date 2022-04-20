import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from '../user/user.repository';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) // NOTE: remove InjectRepository while using custom repo
    private readonly usersRepository: UserRepository,
  ) {}

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateProfile(updateUserDto: UpdateUserDto, user: User): Promise<User> {
    const { name, address } = updateUserDto;

    user.name = name ? name : user.name;
    user.address = address ? address : user.address;

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
