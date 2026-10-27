import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { errorsOf } from "./helpers";

describe("LoginSchema", () => {
  it("accepts an email and a password", () => {
    expect(errorsOf(LoginSchema, { email: "a@b.com", password: "x" })).toEqual([]);
  });

  it("rejects a malformed email with the custom message", () => {
    expect(errorsOf(LoginSchema, { email: "nope", password: "x" })).toEqual([
      "email: Email is required",
    ]);
  });

  it("rejects an empty password", () => {
    expect(errorsOf(LoginSchema, { email: "a@b.com", password: "" })).toEqual([
      "password: Password is required",
    ]);
  });

  it("reports both fields when both are bad", () => {
    expect(errorsOf(LoginSchema, { email: "", password: "" })).toEqual([
      "email: Email is required",
      "password: Password is required",
    ]);
  });

  it("uses the library default message when a field is missing entirely", () => {
    expect(errorsOf(LoginSchema, { email: "a@b.com" })).toEqual([
      "password: Required",
    ]);
  });
});

describe("RegisterSchema", () => {
  const valid = { email: "a@b.com", password: "123456", name: "Ann" };

  it("accepts valid input", () => {
    expect(errorsOf(RegisterSchema, valid)).toEqual([]);
  });

  it("requires at least 6 characters in the password", () => {
    expect(errorsOf(RegisterSchema, { ...valid, password: "12345" })).toEqual([
      "password: Minimum 6 characters required",
    ]);
    expect(errorsOf(RegisterSchema, { ...valid, password: "123456" })).toEqual([]);
  });

  it("requires a name", () => {
    expect(errorsOf(RegisterSchema, { ...valid, name: "" })).toEqual([
      "name: Name is required",
    ]);
  });

  it("requires a valid email", () => {
    expect(errorsOf(RegisterSchema, { ...valid, email: "a@" })).toEqual([
      "email: Email is required",
    ]);
  });
});
