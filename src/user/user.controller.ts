import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {AuthGuard} from "@nestjs/passport";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }

  @Get('/complete')
  @UseGuards(AuthGuard('jwt'))
  findAllComplete() {
    return this.userService.findAllComplete();
  }

  @Post('/create-users')
  createDummyUsers() {
    return this.userService.createDummyUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() userToUpdate: UpdateUserDto) {
    return this.userService.update(id, userToUpdate);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

}
