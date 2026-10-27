import { describe, it, expect } from "vitest";
import { productStockSchema, locationStockSchema } from "@/schemas";
import { errorsOf } from "./helpers";

describe.each([
  ["productStockSchema", productStockSchema, { locationId: "loc1" }, "locationId", "Location is required."],
  ["locationStockSchema", locationStockSchema, { productId: 7 }, "productId", "Product is required."],
] as const)("%s", (_name, schema, base, idField, idMessage) => {
  it("accepts a valid stock entry", () => {
    expect(errorsOf(schema, { ...base, qty: 5 })).toEqual([]);
  });

  describe("qty", () => {
    it("accepts the boundaries 1 and 10000", () => {
      expect(errorsOf(schema, { ...base, qty: 1 })).toEqual([]);
      expect(errorsOf(schema, { ...base, qty: 10000 })).toEqual([]);
    });

    it("rejects values below 1", () => {
      expect(errorsOf(schema, { ...base, qty: 0 })).toEqual([
        "qty: Quantity must be at least 1.",
      ]);
      expect(errorsOf(schema, { ...base, qty: -3 })).toEqual([
        "qty: Quantity must be at least 1.",
      ]);
    });

    it("rejects values above 10000", () => {
      expect(errorsOf(schema, { ...base, qty: 10001 })).toEqual([
        "qty: Quantity cannot exceed 10,000.",
      ]);
    });

    // NumberInput uses valueAsNumber, so an empty box arrives as NaN.
    it("treats NaN, missing and non-number values as 'Qty is required.'", () => {
      expect(errorsOf(schema, { ...base, qty: NaN })).toEqual(["qty: Qty is required."]);
      expect(errorsOf(schema, { ...base })).toEqual(["qty: Qty is required."]);
      expect(errorsOf(schema, { ...base, qty: "5" })).toEqual(["qty: Qty is required."]);
      expect(errorsOf(schema, { ...base, qty: null })).toEqual(["qty: Qty is required."]);
    });

    it("does not currently require a whole number", () => {
      expect(errorsOf(schema, { ...base, qty: 1.5 })).toEqual([]);
    });
  });

  describe(idField, () => {
    it("uses the custom message when missing or null", () => {
      expect(errorsOf(schema, { qty: 5 })).toEqual([`${idField}: ${idMessage}`]);
      expect(errorsOf(schema, { qty: 5, [idField]: null })).toEqual([
        `${idField}: ${idMessage}`,
      ]);
    });
  });
});

describe("id types", () => {
  it("productStockSchema takes a string locationId, not a number", () => {
    expect(errorsOf(productStockSchema, { locationId: 1, qty: 5 })).toEqual([
      "locationId: Location is required.",
    ]);
  });

  it("locationStockSchema takes a numeric productId, not a string", () => {
    expect(errorsOf(locationStockSchema, { productId: "7", qty: 5 })).toEqual([
      "productId: Product is required.",
    ]);
  });
});
