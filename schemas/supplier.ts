import { z } from "zod";

export const addSupplierSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  website: z.string(),
});

export const editSupplierSchema = addSupplierSchema;

export type SupplierValues = z.infer<typeof addSupplierSchema>;
