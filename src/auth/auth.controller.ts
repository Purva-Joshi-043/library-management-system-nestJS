import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Roles } from './enums/role.enum';
import { RoleGuard } from './guards/role.guard';
import { RolesDecorator } from './decorators/roles.decorator';
import { User } from './user.entity';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
  // NOTE: use await in function calls
export class AuthController {
  constructor(private authService: AuthService) {} // NOTE: use readonly
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signup(createUserDto); // NOTE: use await
  }
  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard(), RoleGuard) // NOTE: create custom guard instead of AuthGuard()
  @RolesDecorator(Roles.ADMIN)
  @Get('/get-user/:id') // NOTE: this route should not be inside auth controller
  getUser(@Param('id') id: string): Promise<User> {
    return this.authService.getUser(id);
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  getProfile(@GetUser() user:User):User{
    return user;
  }

  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('/update-profile') // NOTE: this route shoud not be in this controller
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user:User,
  ): Promise<User> {
    return this.authService.updateProfile(updateUserDto,user);
  }

  @RolesDecorator(Roles.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('/:id/update-userrole') // NOTE: change the url path to update-role
  updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.authService.updateUserRole(id, updateUserRoleDto);
  }
}
