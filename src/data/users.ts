import {CreateUserDto} from "../user/dto/create-user.dto";
import {Role} from "../user/role.enum";

/* Account with roles */

export const users: CreateUserDto[] = [
  {username: 'admin', pwd: 'admin', role: Role.Admin},
  {username: 'user', pwd: 'user', role: Role.User}
];