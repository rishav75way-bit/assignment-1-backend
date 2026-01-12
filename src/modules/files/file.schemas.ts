import { z } from "zod";

export const fileIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid file id"),
  }),
});
