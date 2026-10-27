import { z } from "zod";

const qty = z
  .number({ message: "Qty is required." })
  .min(1, { message: "Quantity must be at least 1." })
  .max(10000, { message: "Quantity cannot exceed 10,000." });

// Stock for a product: the form picks a location.
export const productStockSchema = z.object({
  locationId: z.string({ message: "Location is required." }),
  qty,
});

// Stock for a location: the form picks a product.
export const locationStockSchema = z.object({
  productId: z.number({ message: "Product is required." }),
  qty,
});

export type ProductStockValues = z.infer<typeof productStockSchema>;
export type LocationStockValues = z.infer<typeof locationStockSchema>;
