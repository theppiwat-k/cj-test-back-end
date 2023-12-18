import * as bcrypt from 'bcrypt';

export const hash = async (data: string) => {
  const SALT = await bcrypt.genSaltSync(10);
  return bcrypt.hash(data, SALT);
};

export const compareHash = (data: string, hash: string) => {
  return bcrypt.compare(data, hash);
};
