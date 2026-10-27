import { z } from "zod";

export const addCategorySchema = z.object({
  code: z.string().transform((val) => val || null).nullable(),
  name: z.string().min(1, { message: "Name is required." }),
  parentId: z.string().nullable(),
});

export const editCategorySchema = addCategorySchema;

export type AddCategoryValues = z.infer<typeof addCategorySchema>;
export type EditCategoryValues = z.infer<typeof editCategorySchema>;
