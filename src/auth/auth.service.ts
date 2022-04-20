import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './strategy/jwt-payload.interface';
import { User } from '../user/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) // NOTE: remove InjectRepository while using custom repo
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signup(createUserDto: CreateUserDto): Promise<void> {
    return this.usersRepository.createUser(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string,user:User}> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken,user }; 
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

}
