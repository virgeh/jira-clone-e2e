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
  let isVisible;

  it("Should delete issue successfully", () => {
    //add steps to delete issue
    IssueModal.getIssueDetailModal().should("be.visible");
    IssueModal.getIssueDetailModal();
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.validateIssueVisibilityState(issueTitle, (isVisible = !true));
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it("Should cancel deletion process successfully", () => {
    //add steps to start deletion proces but cancel it
    IssueModal.getIssueDetailModal().should("be.visible");
    IssueModal.getIssueDetailModal();
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, (isVisible = true));
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });
});
