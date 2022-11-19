import {Role} from "../role.enum";
import {IsEnum, IsString} from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  pwd: string;
  @IsEnum(Role)
  role: Role;
}