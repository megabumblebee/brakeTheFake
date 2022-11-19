export const secretOrKey: string = process.env.JWT_KEY;
export const saltRounds: number = Number(process.env.JWT_SALT);