import { describe, it, expect } from "vitest";
import { createPropertyValueSchema } from "@/schemas";
import type { Property } from "@/types/entities";
import { errorsOf } from "./helpers";

const property = (id: string, type: string) =>
  ({ id, name: id, type, units: null, unitPosition: "SUFFIX" }) as unknown as Property;

const schema = createPropertyValueSchema([
  property("colour", "STRING"),
  property("length", "NUMBER"),
]);

const NOT_A_NUMBER = ["value: `value` must be a number"];

describe("createPropertyValueSchema", () => {
  describe("string property", () => {
    it("accepts any non-blank text", () => {
      expect(errorsOf(schema, { propertyId: "colour", value: "red" })).toEqual([]);
      expect(errorsOf(schema, { propertyId: "colour", value: "12abc" })).toEqual([]);
    });
  });

  describe("numeric property", () => {
    it("accepts integers, decimals and negatives", () => {
      for (const value of ["12", "12.5", "-3", "0"]) {
        expect(errorsOf(schema, { propertyId: "length", value })).toEqual([]);
      }
    });

    it("rejects non-numeric text, reported against the value field", () => {
      expect(errorsOf(schema, { propertyId: "length", value: "abc" })).toEqual(
        NOT_A_NUMBER
      );
      expect(errorsOf(schema, { propertyId: "length", value: "12abc" })).toEqual(
        NOT_A_NUMBER
      );
    });
  });

  describe("required fields", () => {
    // The refine still runs after min(1) fails, so the field gets two errors.
    // react-hook-form shows the first, so the user sees "Value is required".
    it("requires a value", () => {
      expect(errorsOf(schema, { propertyId: "colour", value: "" })).toEqual([
        "value: Value is required",
        "value: `value` must be a number",
      ]);
    });

    it("requires a property", () => {
      expect(errorsOf(schema, { propertyId: "", value: "red" })).toContain(
        "propertyId: Property is required"
      );
    });
  });

  describe("refine edge cases", () => {
    it("rejects a whitespace-only value, with the numeric message", () => {
      expect(errorsOf(schema, { propertyId: "colour", value: "   " })).toEqual(
        NOT_A_NUMBER
      );
    });

    it("rejects an unknown property id, with the numeric message", () => {
      expect(errorsOf(schema, { propertyId: "nope", value: "red" })).toEqual(
        NOT_A_NUMBER
      );
    });

    it("uses the properties it was built with", () => {
      const onlyString = createPropertyValueSchema([property("length", "STRING")]);
      expect(errorsOf(onlyString, { propertyId: "length", value: "abc" })).toEqual([]);
    });

    it("rejects everything when there are no properties", () => {
      const none = createPropertyValueSchema([]);
      expect(errorsOf(none, { propertyId: "colour", value: "red" })).toEqual(
        NOT_A_NUMBER
      );
    });

    // Documents whether the refine still runs once field-level checks failed.
    it("reports field and refine errors together for an empty form", () => {
      expect(errorsOf(schema, { propertyId: "", value: "" })).toEqual([
        "propertyId: Property is required",
        "value: Value is required",
        "value: `value` must be a number",
      ]);
    });
  });
});
