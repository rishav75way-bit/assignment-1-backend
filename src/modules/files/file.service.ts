import fs from "fs/promises";
import { FileModel } from "../../models/file.model";
import { User } from "../../models/user.model";
import type { ServiceResult } from "../../types/service-result";

type FileDTO = {
  id: string;
  owner: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
};

type UploadResult = {
  file: FileDTO;
};

type ListResult = {
  files: FileDTO[];
};

type DownloadResult = {
  absolutePath: string;
  originalName: string;
};

type MessageResult = {
  message: string;
};

const toDTO = (doc: any): FileDTO => ({
  id: doc._id.toString(),
  owner: doc.owner.toString(),
  originalName: doc.originalName,
  mimeType: doc.mimeType,
  size: doc.size,
  createdAt: doc.createdAt,
});

export const fileService = {
  upload: async (
    userId: string,
    file: Express.Multer.File | undefined
  ): Promise<ServiceResult<UploadResult>> => {
    if (!file) {
      return { ok: false, error: { status: 400, message: "File is required" } };
    }

    const created = await FileModel.create({
      owner: userId,
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path, 
    });

    return { ok: true, data: { file: toDTO(created) } };
  },

  list: async (userId: string): Promise<ServiceResult<ListResult>> => {
    const user = await User.findById(userId).select("role");
    if (!user) {
      return { ok: false, error: { status: 401, message: "Unauthorized" } };
    }

    const query = user.role === "admin" ? {} : { owner: userId };

    const files = await FileModel.find(query).sort({ createdAt: -1 });

    return { ok: true, data: { files: files.map(toDTO) } };
  },

  downloadInfo: async (
    userId: string,
    fileId: string
  ): Promise<ServiceResult<DownloadResult>> => {
    const user = await User.findById(userId).select("role");
    if (!user) {
      return { ok: false, error: { status: 401, message: "Unauthorized" } };
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      return { ok: false, error: { status: 404, message: "File not found" } };
    }

    if (user.role !== "admin" && file.owner.toString() !== userId) {
      return { ok: false, error: { status: 403, message: "Forbidden" } };
    }

    return {
      ok: true,
      data: {
        absolutePath: file.path,
        originalName: file.originalName,
      },
    };
  },

  deleteAny: async (fileId: string): Promise<ServiceResult<MessageResult>> => {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return { ok: false, error: { status: 404, message: "File not found" } };
    }

    try {
      await fs.unlink(file.path);
    } catch {
    }

    await FileModel.deleteOne({ _id: fileId });

    return { ok: true, data: { message: "File deleted" } };
  },
};
