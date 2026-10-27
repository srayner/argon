import { describe, it, expect } from "vitest";
import { addPropertySchema } from "@/schemas";
import { errorsOf } from "./helpers";

describe("addPropertySchema", () => {
  it("accepts a name and a type", () => {
    expect(errorsOf(addPropertySchema, { name: "Length", type: "NUMBER" })).toEqual([]);
  });

  it("accepts units and unitPosition", () => {
    expect(
      errorsOf(addPropertySchema, {
        name: "Length",
        type: "NUMBER",
        units: "mm",
        unitPosition: "SUFFIX",
      })
    ).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(addPropertySchema, { name: "", type: "STRING" })).toEqual([
      "name: Name is required.",
    ]);
  });

  it("requires a type", () => {
    expect(errorsOf(addPropertySchema, { name: "Length" })).toEqual(["type: Required"]);
  });

  it("does not restrict type to known property types", () => {
    expect(errorsOf(addPropertySchema, { name: "Length", type: "WHATEVER" })).toEqual([]);
  });
});
