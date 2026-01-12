import { User } from "../../models/user.model";
import { comparePassword, hashPassword, isValidPassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { generateRandomToken, hashToken } from "../../utils/crypto";
import type { ServiceResult } from "../../types/service-result";
import type {
  LoginResult,
  SignupResult,
  AccessTokenResult,
  MessageResult,
  ResetTokenResult,
} from "./auth.types";

export const authService = {
  signup: async (email: string, password: string): Promise<ServiceResult<SignupResult>> => {
    if (!email || !password) {
      return { ok: false, error: { status: 400, message: "Email & password required" } };
    }
    if (!isValidPassword(password)) {
      return { ok: false, error: { status: 400, message: "Weak password" } };
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return { ok: false, error: { status: 409, message: "User already exists" } };
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ email: email.toLowerCase().trim(), password: hashed });

    return { ok: true, data: { userId: user._id } };
  },

  login: async (email: string, password: string): Promise<ServiceResult<LoginResult>> => {
    if (!email || !password) {
      return { ok: false, error: { status: 400, message: "Email & password required" } };
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return { ok: false, error: { status: 401, message: "Invalid credentials" } };
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return { ok: false, error: { status: 401, message: "Invalid credentials" } };
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = generateRandomToken(40);

    user.refreshToken = hashToken(refreshToken);
    await user.save();

    return {
      ok: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      },
    };
  },

  refreshToken: async (refreshToken: string | undefined): Promise<ServiceResult<AccessTokenResult>> => {
    if (!refreshToken) {
      return { ok: false, error: { status: 401, message: "No refresh token" } };
    }

    const user = await User.findOne({ refreshToken: hashToken(refreshToken) });
    if (!user) {
      return { ok: false, error: { status: 401, message: "Invalid refresh token" } };
    }

    const accessToken = signAccessToken(user._id.toString());
    return { ok: true, data: { accessToken } };
  },

  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ServiceResult<MessageResult>> => {
    if (!currentPassword || !newPassword) {
      return { ok: false, error: { status: 400, message: "Current and new password required" } };
    }
    if (!isValidPassword(newPassword)) {
      return { ok: false, error: { status: 400, message: "Weak password" } };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { ok: false, error: { status: 404, message: "User not found" } };
    }

    const match = await comparePassword(currentPassword, user.password);
    if (!match) {
      return { ok: false, error: { status: 401, message: "Wrong current password" } };
    }

    user.password = await hashPassword(newPassword);
    user.refreshToken = undefined;
    await user.save();

    return { ok: true, data: { message: "Password changed" } };
  },

  forgotPassword: async (email: string): Promise<ServiceResult<ResetTokenResult>> => {
    if (!email) {
      return { ok: false, error: { status: 400, message: "Email is required" } };
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return { ok: false, error: { status: 404, message: "User not found" } };
    }

    const resetToken = generateRandomToken(32);
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return { ok: true, data: { resetToken } };
  },

  resetPassword: async (token: string, newPassword: string): Promise<ServiceResult<MessageResult>> => {
    if (!token || !newPassword) {
      return { ok: false, error: { status: 400, message: "Token and new password required" } };
    }
    if (!isValidPassword(newPassword)) {
      return { ok: false, error: { status: 400, message: "Weak password" } };
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return { ok: false, error: { status: 400, message: "Token expired or invalid" } };
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    return { ok: true, data: { message: "Password reset successful" } };
  },

  logout: async (refreshToken: string | undefined): Promise<ServiceResult<MessageResult>> => {
    if (refreshToken) {
      await User.updateOne(
        { refreshToken: hashToken(refreshToken) },
        { $unset: { refreshToken: "" } }
      );
    }

    return { ok: true, data: { message: "Logged out" } };
  },
};
