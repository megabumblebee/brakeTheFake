import * as bcrypt from 'bcrypt';

export const hashPwd = async (saltRounds: number, pwd: string): Promise<string> => {
  return bcrypt.hash(pwd, saltRounds);
}