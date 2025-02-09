describe("Adds multiple products", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds multiple products", () => {
    const products = [
      { name: "Product A", qtyInStock: 10 },
      { name: "Product B", qtyInStock: 5 },
      { name: "Product C", qtyInStock: 20 },
      { name: "Product D", qtyInStock: 0 },
    ];

    products.forEach((product) => {
      // Navigate to products listing
      cy.get('[data-e2e="products-link"]').click();
      cy.url().should("include", "/products");

      // Add a new product
      cy.contains("a", "Add").click();
      cy.get('input[name="name"]').clear().type(product.name);
      cy.get('input[name="qtyInStock"]').clear().type(product.qtyInStock);
      cy.contains("button", "Add").click();

      // Verify product is added
      cy.get("#search").clear().type(product.name);
      cy.contains("a", product.name).first().click();
      cy.contains("h1", product.name);
    });
  });
});
