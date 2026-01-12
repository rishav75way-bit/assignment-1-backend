import { Response } from "express";

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true, 
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken");
};
