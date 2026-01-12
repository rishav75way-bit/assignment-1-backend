import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
}

export const signAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as AccessTokenPayload;
};
