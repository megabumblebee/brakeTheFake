import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ChangeUserResponse, RegisterUserResponse} from "./user.interface";
import {User} from "./entities/user.entity";
import {hashPwd} from "../utils/hash-pwd";
import {saltRounds} from "../config/jwt.config";
import {Role} from "./role.enum";

@Injectable()
export class UserService {

  filter(user: User): RegisterUserResponse {
    const {id, username} = user;
    return {id, username};
  }

  async create(newUser: CreateUserDto): Promise<RegisterUserResponse> {
    if ((await this.findUserByEmail(newUser.username)).length === 0) {
      const readyUser = new User();
      readyUser.username = newUser.username;
      readyUser.pwdHash = await hashPwd(saltRounds, newUser.pwd);
      readyUser.roles = [newUser.role];

      await readyUser.save();

      return this.filter(readyUser);
    }
    return null;
  }

  async findAll(): Promise<RegisterUserResponse[]> {
    return (await User.find()).map(this.filter);
  }

  async findAllComplete(): Promise<User[]> {
    return (await User.find());
  }

  async findOne(id: string): Promise<RegisterUserResponse> {
    return this.filter(await User.findOneBy({id}));
  }

  async update(id: string, propsToUpdate: UpdateUserDto): Promise<ChangeUserResponse> {
    try {
      await User.update(id, propsToUpdate);
      return {id, success: true};
    } catch (e) {
      return {id, success: false}
    }
  }

  async remove(id: string): Promise<ChangeUserResponse> {
    try {
      const {affected} = await User.delete(id);
      if (affected) return {id, success: true};
      else throw new Error(`There is not User with id: ${id}`);
    } catch (e) {
      console.error(e);
      return {id, success: false}
    }
  }

  private async findUserByEmail(username: string): Promise<User[]> {
    return await User.findBy({username});
  }

  async createDummyUsers(): Promise<{ success: boolean }> {
    const users: CreateUserDto[] = [
      {username: 'admin', pwd: 'admin', role: Role.Admin},
      {username: 'user', pwd: 'user', role: Role.User}
    ];

    for (const user of users) {
      if(!await User.findOneBy({username: user.username})){
        const newUser = new User();
        newUser.username = user.username;
        newUser.pwdHash = await hashPwd(saltRounds, user.pwd);
        newUser.roles = [user.role];

        await newUser.save();
      }
    }
    return {success: true};
  }
}