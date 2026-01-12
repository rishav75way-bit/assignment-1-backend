import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";

import { uploadSingleFile } from "./file.upload";
import { fileIdParamSchema } from "./file.schemas";

import { uploadFile, listFiles, downloadFile, deleteFile } from "./file.controller";

const router = Router();

router.post("/upload", authenticate, uploadSingleFile, uploadFile);
router.get("/", authenticate, listFiles);

router.get("/:id", authenticate, validate(fileIdParamSchema), downloadFile);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate(fileIdParamSchema),
  deleteFile
);

export default router;
