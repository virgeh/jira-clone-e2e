describe("Time Tracking Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("include", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.url().should("include", "/board");
        cy.contains("This is an issue of type: Task.").click();
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  const addEstimation = (estimation) => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('input[placeholder="Number"]')
      .first()
      .clear({ force: true })
      .type(estimation, { force: true });
    cy.contains("button", "Done").click({ force: true }).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]')
      .should("be.visible")
      .contains("estimated");
  };

  const editEstimation = (newEstimation) => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('input[placeholder="Number"]')
      .first()
      .clear({ force: true })
      .type(newEstimation, { force: true });
    cy.contains("button", "Done").click({ force: true }).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]')
      .should("be.visible")
      .contains("Estimated")
      .should("contain", newEstimation);
  };

  const removeEstimation = () => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('input[placeholder="Number"]').first().clear({ force: true });
    cy.contains("button", "Done").click({ force: true }).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]')
      .should("be.visible")
      .contains("Estimated")
      .should("not.exist");
  };

  const logTime = (timeSpent, timeRemaining) => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('input[placeholder="Number"]')
      .eq(0)
      .clear({ force: true })
      .type(timeSpent, { force: true });
    cy.get('input[placeholder="Number"]')
      .eq(1)
      .clear({ force: true })
      .type(timeRemaining, { force: true });
    cy.contains("button", "Done").click({ force: true }).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]')
      .should("be.visible")
      .contains("Logged", { timeout: 10000 })
      .should("contain", timeSpent);
  };

  it("Should add, edit, and remove a time estimation successfully", () => {
    const initialEstimation = "8h";
    const updatedEstimation = "5h";

    // Add a time estimation
    addEstimation(initialEstimation);

    // Edit the time estimation
    editEstimation(updatedEstimation);

    // Remove the time estimation
    removeEstimation();
  });

  it("Should log time successfully", () => {
    const timeSpent = "4h";
    const timeRemaining = "2h";

    // Log time
    logTime(timeSpent, timeRemaining);
  });
});
