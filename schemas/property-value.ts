import { z } from "zod";
import { Property } from "@/types/entities";

// The value rules depend on the type of the selected property, so the schema
// is built from the list of properties the form offers.
export const createPropertyValueSchema = (properties: Property[]) =>
  z
    .object({
      propertyId: z.string().min(1, "Property is required"),
      value: z.string().min(1, "Value is required"),
    })
    .refine(
      ({ propertyId, value }) => {
        const property = properties.find(
          (property) => property.id === propertyId
        );

        // If the property doesn't exist, return false (validation fails)
        if (!property) {
          return false;
        }

        if (value.trim() === "") {
          return false;
        }

        // If the property type is "STRING", ensure the value is a string
        if (property.type === "STRING" && typeof value !== "string") {
          return false;
        }

        // If the property type is numeric (any other type), ensure the value is a valid number
        if (property.type !== "STRING" && isNaN(Number(value))) {
          return false;
        }

        return true;
      },
      { path: ["value"], error: "`value` must be a number" }
    );

export type PropertyValueFormData = z.infer<
  ReturnType<typeof createPropertyValueSchema>
>;
