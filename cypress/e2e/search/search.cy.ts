describe("Adds a new category", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("performs a search", () => {
    // Navagite to the category we want
    cy.contains("a", "Advanced Search").first().click();
    cy.contains("a", "Resistors").first().click();
    cy.contains("a", "Through Hole Resistors").first().click();

    // Verify the properties exist
    cy.contains("h3", "Resistance");
    cy.contains("h3", "Power Rating");

    // Perform the search
    cy.contains("button", "Apply Filters").click();

    // Verify and click the result
    cy.contains("a", "100 Ohm Resistor").first().click();
    cy.contains("h1", "100 Ohm Resistor");
  });
});
