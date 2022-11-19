import { IsBoolean, IsString } from "class-validator";

export class AuthLoginDto {
  @IsString()
  username: string;

  @IsString()
  pwd: string;

  @IsBoolean()
  remember: boolean;
}