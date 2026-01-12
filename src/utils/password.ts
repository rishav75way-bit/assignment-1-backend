import bcrypt from "bcrypt";

export const isValidPassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
