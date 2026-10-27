import { z } from "zod";

export const addLocationSchema = z.object({
  code: z.string().nullable().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  parentId: z.string().nullable(),
});

export const editLocationSchema = z.object({
  code: z.string(),
  name: z.string().min(1, { message: "Name is required." }),
  parentId: z.string().nullable(),
});

export type AddLocationValues = z.infer<typeof addLocationSchema>;
export type EditLocationValues = z.infer<typeof editLocationSchema>;
