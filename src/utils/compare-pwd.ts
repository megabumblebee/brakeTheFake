import * as bcrypt from 'bcrypt';

export const comparePwd = (pwd: string, hashPwd: string): Promise<boolean | undefined> => {
  return bcrypt.compare(pwd, hashPwd);
}