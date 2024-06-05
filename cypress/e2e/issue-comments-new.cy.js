describe("Issue comments creating, editing, and deleting", () => {
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

  function addComment(comment) {
    cy.contains("Add a comment...").click();
    cy.get('textarea[placeholder="Add a comment..."]').type(comment);
    cy.contains("button", "Save").click().should("not.exist");
  }

  function editComment(previousComment, newComment) {
    cy.get('[data-testid="issue-comment"]')
      .first()
      .contains("Edit")
      .click()
      .should("not.exist");
    cy.get('textarea[placeholder="Add a comment..."]')
      .should("contain", previousComment)
      .clear()
      .type(newComment);
    cy.contains("button", "Save").click().should("not.exist");
  }

  function deleteComment() {
    cy.get('[data-testid="issue-comment"]').contains("Delete").click();
    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  }

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  function assertCommentVisible(comment) {
    cy.get('[data-testid="issue-comment"]').should("contain", comment);
  }

  function assertCommentNotVisible() {
    cy.get('[data-testid="issue-comment"]').should("not.exist");
  }

  it("Should create, edit, and delete a comment successfully", () => {
    const initialComment = "INITIAL_COMMENT";
    const editedComment = "EDITED_COMMENT";

    // Add a comment
    getIssueDetailsModal().within(() => {
      addComment(initialComment);
      assertCommentVisible(initialComment);
    });

    // Edit the comment
    getIssueDetailsModal().within(() => {
      editComment(initialComment, editedComment);
      assertCommentVisible(editedComment);
    });

    // Delete the comment
    getIssueDetailsModal().within(() => {
      deleteComment();
      assertCommentNotVisible();
    });
  });
});
