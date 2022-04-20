import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserDto } from '../user/dto/update-user-dto';
import { UpdateUserRoleDto } from '../user/dto/update-user-role.dto';
import { Roles } from '../auth/enums/role.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { RolesDecorator } from '../auth/decorators/roles.decorator';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RoleGuard) 
  @RolesDecorator(Roles.ADMIN)
  @Get('/get-user/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getProfile(@GetUser() user: User): User {
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Patch('/update-profile') 
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateProfile(updateUserDto, user);
  }

  @RolesDecorator(Roles.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('/:id/update-role')
  updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.userService.updateUserRole(id, updateUserRoleDto);
  }
}
