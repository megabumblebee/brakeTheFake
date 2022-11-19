export interface RegisterUserResponse {
  id: string;
  username: string;
}

export interface ChangeUserResponse {
  id: string,
  success: boolean,
}

export enum UserRole {
  Admin,
  User,
}