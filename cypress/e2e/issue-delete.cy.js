describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        // Assert the visibility of the issue detail view modal
        cy.contains("This is an issue of type: Task.").click();
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  it("Should delete an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    // Confirm deletion in the pop-up
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("button", "Delete issue").click();
    });

    // Ensure the modal is closed
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");

    // Reload the page to verify the issue is deleted
    cy.reload();
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });

  it("Should cancel the deletion and ensure the issue still exists", () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    // Cancel deletion in the pop-up
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("button", "Cancel").click();
    });

    // Ensure the deletion confirmation dialogue is closed
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Ensure the issue details modal is still visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Ensure the issue is still displayed on the board
    cy.reload();
    cy.contains("This is an issue of type: Task.").should("be.visible");
  });
});
