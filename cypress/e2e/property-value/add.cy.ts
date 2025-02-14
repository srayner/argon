import { forEach } from "cypress/types/lodash";

describe("Adds some new property values", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds some property values", () => {
    // Navigate to products
    cy.get('[data-e2e="products-link"]').click();
    cy.url().should("include", "/products");

    // Navigate to product
    cy.contains("a", "100 Ohm Resistor").first().click();

    const valuesToAdd = [
      { type: "Type", value: "Through Hole", expected: "Through Hole" },
      { type: "Pack Qty", value: "12", expected: "Through Hole" },
      { type: "Lead Diameter", value: "0.6", expected: "0.6mm" },
      { type: "Prefix", value: "44", expected: "#44" },
    ];

    valuesToAdd.forEach((value) => {
      cy.get('[data-e2e="add-property-value-button"]').click();
      cy.get('select[name="propertyId"]')
        .should("be.visible")
        .should("not.be.disabled")
        .select(value.type);
      cy.get('input[name="value"]').clear().type(value.value);
      cy.contains("button", "Add").click();
      cy.contains(value.expected).should("be.visible");
    });
  });
});
