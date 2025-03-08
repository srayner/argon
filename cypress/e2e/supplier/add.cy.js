describe("Adds a new supplier", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds a supplier", () => {
    const data = { name: "New Supplier" };

    // Navigate to suppliers.
    cy.get('[data-e2e="suppliers-link"]').click();
    cy.url().should("include", "/suppliers");

    // Navigate to 'Add' page.
    cy.contains("a", "Add").click();
    cy.url().should("include", "/dashboard/suppliers/add");

    // Enter the details and submit form.
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    // Check we redirected to supplier detail page.
    cy.url().should("match", /\/dashboard\/suppliers\/[a-z0-9]+$/);

    cy.contains("h1", data.name);
  });
});
