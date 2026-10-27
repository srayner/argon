import { describe, it, expect } from "vitest";
import { addLocationSchema, editLocationSchema } from "@/schemas";
import { errorsOf } from "./helpers";

describe("addLocationSchema", () => {
  const valid = { name: "Shelf 1", parentId: null };

  it("accepts a valid location without a code", () => {
    expect(errorsOf(addLocationSchema, valid)).toEqual([]);
  });

  it("allows code to be a string, null or omitted", () => {
    expect(errorsOf(addLocationSchema, { ...valid, code: "A1" })).toEqual([]);
    expect(errorsOf(addLocationSchema, { ...valid, code: null })).toEqual([]);
    expect(errorsOf(addLocationSchema, { ...valid, code: undefined })).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(addLocationSchema, { ...valid, name: "" })).toEqual([
      "name: Name is required.",
    ]);
  });

  it("requires the parentId key but allows null", () => {
    expect(errorsOf(addLocationSchema, { name: "Shelf 1" })).toEqual([
      "parentId: Invalid input: expected string, received undefined",
    ]);
    expect(errorsOf(addLocationSchema, { ...valid, parentId: "p1" })).toEqual([]);
  });
});

describe("editLocationSchema", () => {
  const valid = { code: "A1", name: "Shelf 1", parentId: null };

  it("accepts a valid location", () => {
    expect(errorsOf(editLocationSchema, valid)).toEqual([]);
  });

  it("accepts an empty-string code", () => {
    expect(errorsOf(editLocationSchema, { ...valid, code: "" })).toEqual([]);
  });

  it("does not allow a null or missing code (unlike add)", () => {
    expect(errorsOf(editLocationSchema, { ...valid, code: null })).toEqual([
      "code: Invalid input: expected string, received null",
    ]);
    expect(errorsOf(editLocationSchema, { name: "Shelf 1", parentId: null })).toEqual([
      "code: Invalid input: expected string, received undefined",
    ]);
  });

  it("requires a name", () => {
    expect(errorsOf(editLocationSchema, { ...valid, name: "" })).toEqual([
      "name: Name is required.",
    ]);
  });
});
