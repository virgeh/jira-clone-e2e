/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        //open issue detail modal with title from line 16
        cy.contains(issueTitle).click();
      });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = "This is an issue of type: Task.";

  it("Should delete issue successfully", () => {
    // Click the delete button in the issue detail modal
    IssueModal.clickDeleteButton();

    // Confirm the deletion in the confirmation popup
    IssueModal.confirmDeletion();

    // Validate that the issue modal is closed
    IssueModal.getIssueDetailModal().should("not.exist");

    // Validate that the issue is no longer visible on the board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it("Should cancel the deletion and ensure the issue still exists", () => {
    // Click the delete button in the issue detail modal
    IssueModal.clickDeleteButton();

    // Cancel the deletion in the confirmation popup
    IssueModal.cancelDeletion();

    // Ensure the deletion confirmation dialog is closed
    cy.get(IssueModal.confirmationPopup).should("not.exist");

    // Ensure the issue details modal is still visible
    IssueModal.getIssueDetailModal().should("be.visible");

    // Ensure the issue is still displayed on the board
    cy.contains(issueTitle).should("be.visible");
  });
});
