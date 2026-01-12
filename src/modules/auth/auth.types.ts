export interface UserDTO {
  id: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface AccessTokenResult {
  accessToken: string;
}

export interface SignupResult {
  userId: unknown;
}

export interface MessageResult {
  message: string;
}

export interface ResetTokenResult {
  resetToken: string;
}
