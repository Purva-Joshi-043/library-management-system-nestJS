import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './enums/role.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, name, address, role } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      name,
      email:email.toLowerCase(),
      password: hashedPassword,
      address,
      role,
    });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
