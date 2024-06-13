describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      // Existing test code
    });
  });

  it("Should update title, description successfully", () => {
    // Existing test code
  });

  it("Should validate that the reporter's name has only characters", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          expect(reporterName.trim()).to.match(/^[A-Za-z\s]+$/);
        });
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
