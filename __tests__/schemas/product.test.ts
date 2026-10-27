import { describe, it, expect } from "vitest";
import { addProductSchema, editProductSchema } from "@/schemas";
import { errorsOf } from "./helpers";

const base = {
  name: "Screw",
  categoryId: null,
  manufacturerId: null,
  supplierId: null,
  cost: null,
};

describe.each([
  ["addProductSchema", addProductSchema, { manufacturerPartNo: "M1", supplierPartNo: "S1" }],
  ["editProductSchema", editProductSchema, { manufacturerPartNo: "M1", supplierPartNo: "S1" }],
] as const)("%s (shared rules)", (_name, schema, parts) => {
  const valid = { ...base, ...parts };

  it("accepts a valid product", () => {
    expect(errorsOf(schema, valid)).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(schema, { ...valid, name: "" })).toEqual([
      "name: Name is required.",
    ]);
  });

  it("accepts ids and cost as numbers or null", () => {
    expect(
      errorsOf(schema, { ...valid, manufacturerId: 3, supplierId: 4, cost: 1.25 })
    ).toEqual([]);
  });

  it("accepts a string categoryId", () => {
    expect(errorsOf(schema, { ...valid, categoryId: "c1" })).toEqual([]);
  });

  // NumberInput yields NaN for an empty numeric box unless isFloat is set.
  it("rejects NaN for a numeric field", () => {
    expect(errorsOf(schema, { ...valid, manufacturerId: NaN })).toEqual([
      "manufacturerId: Invalid input: expected number, received NaN",
    ]);
  });

  it("rejects a numeric string for cost", () => {
    expect(errorsOf(schema, { ...valid, cost: "1.5" })).toEqual([
      "cost: Invalid input: expected number, received string",
    ]);
  });

  it("requires the nullable keys to be present", () => {
    const { cost, ...rest } = valid;
    expect(errorsOf(schema, rest)).toEqual(["cost: Invalid input: expected number, received undefined"]);
  });
});

describe("part numbers", () => {
  it("are optional strings when adding", () => {
    expect(errorsOf(addProductSchema, base)).toEqual([]);
    expect(errorsOf(addProductSchema, { ...base, manufacturerPartNo: null })).toEqual([
      "manufacturerPartNo: Invalid input: expected string, received null",
    ]);
  });

  it("are nullable but required when editing", () => {
    expect(
      errorsOf(editProductSchema, { ...base, manufacturerPartNo: null, supplierPartNo: null })
    ).toEqual([]);
    expect(errorsOf(editProductSchema, base)).toEqual([
      "manufacturerPartNo: Invalid input: expected string, received undefined",
      "supplierPartNo: Invalid input: expected string, received undefined",
    ]);
  });
});
