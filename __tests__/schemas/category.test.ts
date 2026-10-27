import { describe, it, expect } from "vitest";
import { addCategorySchema, editCategorySchema } from "@/schemas";
import { errorsOf, parsed } from "./helpers";

describe.each([
  ["addCategorySchema", addCategorySchema],
  ["editCategorySchema", editCategorySchema],
] as const)("%s", (_name, schema) => {
  const valid = { code: "C1", name: "Bolts", parentId: null };

  it("accepts a valid category", () => {
    expect(errorsOf(schema, valid)).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(schema, { ...valid, name: "" })).toEqual([
      "name: Name is required.",
    ]);
  });

  it("turns an empty code into null", () => {
    expect(parsed(schema, { ...valid, code: "" }).code).toBeNull();
  });

  it("keeps a non-empty code", () => {
    expect(parsed(schema, { ...valid, code: "C1" }).code).toBe("C1");
  });

  it("accepts a null code", () => {
    expect(parsed(schema, { ...valid, code: null }).code).toBeNull();
  });

  it("requires a code key (undefined is rejected)", () => {
    expect(errorsOf(schema, { name: "Bolts", parentId: null })).toEqual([
      "code: Required",
    ]);
  });

  it("accepts a string parentId", () => {
    expect(parsed(schema, { ...valid, parentId: "abc" }).parentId).toBe("abc");
  });

  it("uses the library default message for a non-string, non-null parentId", () => {
    expect(errorsOf(schema, { ...valid, parentId: 5 })).toEqual([
      "parentId: Expected string, received number",
    ]);
  });
});

describe("parentId when omitted", () => {
  const input = { code: "C1", name: "Bolts" };

  it("defaults to null when adding", () => {
    expect(parsed(addCategorySchema, input).parentId).toBeNull();
  });

  it("is required when editing", () => {
    expect(errorsOf(editCategorySchema, input)).toEqual(["parentId: Required"]);
  });
});
