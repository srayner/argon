describe("Adds a new manufacturer", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds a manufacturer", () => {
    const data = { name: "New Manufacturer" };

    // Navigate to manufacturers.
    cy.get('[data-e2e="manufacturers-link"]').click();
    cy.url().should("include", "/manufacturers");

    // Navigate to 'Add' page.
    cy.contains("a", "Add").click();
    cy.url().should("include", "/dashboard/manufacturers/add");

    // Enter the details and submit form.
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    // Check we redirected to manufacturer detail page.
    cy.url().should("match", /\/dashboard\/manufacturers\/[a-z0-9]+$/);

    // Check details of the manufacturer we added.
    cy.contains("h1", data.name);
  });
});
