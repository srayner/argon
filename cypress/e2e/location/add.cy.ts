describe("Adds a new location", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds a location", () => {
    const data = { name: "New Location" };

    cy.get('[data-e2e="locations-link"]').click();
    cy.url().should("include", "/locations");

    cy.contains("a", "Add").click();
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    cy.get("#search").clear().type(data.name);

    cy.contains("a", data.name).first().click();

    cy.contains("h1", data.name);
  });
});
