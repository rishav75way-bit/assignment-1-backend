export type ServiceError = {
  status: number;
  message: string;
};

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ServiceError };
