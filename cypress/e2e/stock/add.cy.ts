describe("Adds some new properties", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds stock", () => {
    const data = { location: "Bin 103", qty: "50" };

    // Navigate to products
    cy.get('[data-e2e="products-link"]').click();
    cy.url().should("include", "/products");

    // Navigate to 100ohm resistor
    cy.contains("a", "100 Ohm Resistor").first().click();

    // Add stock
    cy.get('[data-e2e="add-stock-button"]').click();
    cy.get('[data-e2e="locationId-select"]')
      .click()
      .find("li")
      .contains(data.location)
      .click();
    cy.get('input[name="qty"]').clear().type(data.qty);
    cy.contains("button", "Add").click();

    // Assert the stock entry exists
    cy.get('div[data-e2e="stock-locations-panel"]')
      .find('div[role="row"].ag-row')
      .should("exist")
      .then((rows) => {
        const matchingRow = [...rows].find((row) => {
          const columns = Cypress.$(row).find('div[role="gridcell"]');
          return (
            columns.eq(0).text().trim() === data.location &&
            columns.eq(1).text().trim() === data.qty
          );
        });

        expect(matchingRow).to.not.be.undefined;
      });
  });
});
