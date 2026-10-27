import { describe, it, expect } from "vitest";
import { addSupplierSchema, editSupplierSchema } from "@/schemas";
import { errorsOf } from "./helpers";

describe.each([
  ["addSupplierSchema", addSupplierSchema],
  ["editSupplierSchema", editSupplierSchema],
] as const)("%s", (_name, schema) => {
  it("accepts a name and a website", () => {
    expect(errorsOf(schema, { name: "Acme", website: "https://acme.test" })).toEqual([]);
  });

  it("accepts an empty website", () => {
    expect(errorsOf(schema, { name: "Acme", website: "" })).toEqual([]);
  });

  it("does not validate the website as a URL", () => {
    expect(errorsOf(schema, { name: "Acme", website: "not a url" })).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(schema, { name: "", website: "" })).toEqual([
      "name: Name is required.",
    ]);
  });

  it("requires the website key", () => {
    expect(errorsOf(schema, { name: "Acme" })).toEqual(["website: Invalid input: expected string, received undefined"]);
  });

  it("rejects a null website", () => {
    expect(errorsOf(schema, { name: "Acme", website: null })).toEqual([
      "website: Invalid input: expected string, received null",
    ]);
  });
});
