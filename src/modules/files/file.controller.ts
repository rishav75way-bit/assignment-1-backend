import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { fileService } from "./file.service";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const userId: string | undefined = res.locals.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await fileService.upload(userId, req.file);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(201).json(result.data);
});

export const listFiles = asyncHandler(async (_req: Request, res: Response) => {
  const userId: string | undefined = res.locals.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await fileService.list(userId);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});

export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const userId: string | undefined = res.locals.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;

  const result = await fileService.downloadInfo(userId, id);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.download(result.data.absolutePath, result.data.originalName);
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await fileService.deleteAny(id);

  if (!result.ok) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json(result.data);
});
