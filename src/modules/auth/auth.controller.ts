import { Request, Response } from "express";
import { authService } from "./auth.service";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../../utils/cookies";
import { asyncHandler } from "../../utils/asyncHandler";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.signup(email, password);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(201).json({ message: "User created", userId: result.data.userId });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  setRefreshTokenCookie(res, result.data.refreshToken);

  return res.status(200).json({
    accessToken: result.data.accessToken,
    user: result.data.user, 
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies?.refreshToken;

  const result = await authService.refreshToken(token);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json({ accessToken: result.data.accessToken });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId: string | undefined = res.locals.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(userId, currentPassword, newPassword);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const result = await authService.resetPassword(token, newPassword);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies?.refreshToken;

  const result = await authService.logout(token);

  clearRefreshTokenCookie(res);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});
