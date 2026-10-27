import { z } from "zod";

export const addPropertySchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  type: z.string(),
  units: z.string().optional(),
  unitPosition: z.string().optional(),
});

export type AddPropertyValues = z.infer<typeof addPropertySchema>;
