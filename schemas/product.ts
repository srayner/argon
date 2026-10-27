import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  categoryId: z.string().nullable(),
  manufacturerId: z.number().nullable(),
  manufacturerPartNo: z.string().optional(),
  supplierId: z.number().nullable(),
  supplierPartNo: z.string().optional(),
  cost: z.number().nullable(),
});

export const editProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  categoryId: z.string().nullable(),
  manufacturerId: z.number().nullable(),
  manufacturerPartNo: z.string().nullable(),
  supplierId: z.number().nullable(),
  supplierPartNo: z.string().nullable(),
  cost: z.number().nullable(),
});

export type AddProductValues = z.infer<typeof addProductSchema>;
export type EditProductValues = z.infer<typeof editProductSchema>;
