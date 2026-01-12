import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { generateRandomToken } from "../../utils/crypto";
import { ApiError } from "../../errors/ApiError";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE_BYTES || 5 * 1024 * 1024);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const safeName = `${Date.now()}-${generateRandomToken(16)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new ApiError(400, "Invalid file type. Only PNG, JPG, PDF allowed."));
    }
    cb(null, true);
  },
});

export const uploadSingleFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err: any) => {
    if (!err) return next();

    if (err?.code === "LIMIT_FILE_SIZE") {
      return next(
        new ApiError(400, `File too large. Max allowed is ${MAX_FILE_SIZE_BYTES} bytes.`)
      );
    }

    return next(err);
  });
};
