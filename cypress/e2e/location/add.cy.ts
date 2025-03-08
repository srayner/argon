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

    // Navigate to locations.
    cy.get('[data-e2e="locations-link"]').click();
    cy.url().should("include", "/locations");

    // Navigate to 'Add' page.
    cy.contains("a", "Add").click();
    cy.url().should("include", "/dashboard/locations/add");

    // Enter the details and submit form.
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    // Check we redirected to location detail page.
    cy.url().should("match", /\/dashboard\/locations\/[a-z0-9]+$/);

    // Check details of the location we added.
    cy.contains("h1", data.name);
  });
});
