describe("Adds some new properties", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds a property", () => {
    const data = { name: "New Manufacturer" };

    // Navigate to categories
    cy.get('[data-e2e="categories-link"]').click();
    cy.url().should("include", "/categories");

    // Navigate to resistors
    cy.contains("a", "Through Hole Resistors").first().click();

    // Add a string property
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Type");
    cy.contains("button", "Add").click();

    // Add a numeric property
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Pack Qty");
    cy.get('select[name="type"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Numeric");
    cy.contains("button", "Add").click();

    // Add a numeric property with units (suffix)
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Lead Diameter");
    cy.get('select[name="type"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Numeric");
    cy.get('input[name="units"]').clear().type("mm");
    cy.contains("button", "Add").click();

    // Add a numeric property with units (prefix)
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Prefix");
    cy.get('select[name="type"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Numeric");
    cy.get('input[name="units"]').clear().type("#");
    cy.get('select[name="unitPosition"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Prefix");
    cy.contains("button", "Add").click();

    // Add a metric property with units (suffix)
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Resistance");
    cy.get('select[name="type"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Metric");
    cy.get('input[name="units"]').clear().type("Ω");
    cy.contains("button", "Add").click();

    // Add an imperial property with units (suffix)
    cy.get('[data-e2e="add-property-button"]').click();
    cy.get('input[name="name"]').clear().type("Length");
    cy.get('select[name="type"]')
      .should("be.visible")
      .should("not.be.disabled")
      .select("Imperial");
    cy.get('input[name="units"]').clear().type('"');
    cy.contains("button", "Add").click();
  });
});
