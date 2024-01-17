import { Controller, Post, Body, Get, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
// Import UserDto
import { UserDto } from './dto/user.dto'; 

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  getUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<UserDto>  {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() user: User) {
    return this.userService.createUser(user);
  }

  // Delete user added
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // HTTP  code 204 => No Content
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
