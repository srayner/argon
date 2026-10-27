import type { z } from "zod";

// Flatten a failed parse into "path: message" strings so tests assert on the
// exact wording and location of each error. Returns [] when the input is valid.
export const errorsOf = (schema: z.ZodType, input: unknown): string[] => {
  const result = schema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map(
    (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`
  );
};

// The parsed (output) value of a schema, throwing if the input is invalid.
export const parsed = <T extends z.ZodType>(schema: T, input: unknown): z.output<T> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Expected valid input, got: ${errorsOf(schema, input)}`);
  }
  return result.data;
};
