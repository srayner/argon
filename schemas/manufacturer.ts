import { z } from "zod";

export const addManufacturerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  website: z.string(),
});

export const editManufacturerSchema = addManufacturerSchema;

export type ManufacturerValues = z.infer<typeof addManufacturerSchema>;
