describe("Adds a new category", () => {
  // Login once for all tests in this block
  before(() => {
    cy.visit("http://localhost:3000/auth/login");
    cy.get('input[name="email"]').clear().type("user@example.com");
    cy.get('input[name="password"]').clear().type(Cypress.env("USER_PASSWORD"));
    cy.contains("button", "Login").click();
  });

  it("adds a category", () => {
    const data = { name: "New Category" };

    // Navigate to categories.
    cy.get('[data-e2e="categories-link"]').click();
    cy.url().should("include", "/categories");

    // Navigate to 'Add' page.
    cy.contains("a", "Add").click();
    cy.url().should("include", "/dashboard/categories/add");

    // Enter the details and submit form.
    cy.get('input[name="name"]').clear().type(data.name);
    cy.contains("button", "Add").click();

    // Check we redirected to category detail page.
    cy.url().should("match", /\/dashboard\/categories\/[a-z0-9]+$/);

    // Check details of the category we added.
    cy.contains("h1", data.name);
  });
});
