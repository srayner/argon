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

    cy.get('[data-e2e="manufacturers-link"]').click();
    cy.url().should("include", "/manufacturers");

    cy.contains("a", "Add").click();
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    cy.get("#search").clear().type(data.name);

    cy.contains("a", data.name).first().click();

    cy.contains("h1", data.name);
  });
});
