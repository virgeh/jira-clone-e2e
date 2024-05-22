import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      // Log the URL for debugging purposes
      cy.log(`Navigating to URL: ${url}/board?modal-issue-create=true`);
      cy.visit(url + '/board?modal-issue-create=true');
      // Log after navigation to confirm the page loaded
      cy.log('Page visited, waiting for the modal to appear');
    });
  });

 
  it('Should create an issue and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
    //assigment 1 test passed
  });
 
  // New Test Case for Creating Another Issue
it('Should create a second issue and validate it successfully', () => {
  // System finds modal for creating issue and does next steps inside of it
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    // Type value to description input field
    cy.get('.ql-editor').type('SECOND_TEST_DESCRIPTION');
    cy.get('.ql-editor').should('have.text', 'SECOND_TEST_DESCRIPTION');

    // Type value to title input field
    // Order of filling in the fields is first description, then title on purpose
    // Otherwise filling title first sometimes doesn't work due to web page implementation
    cy.get('input[name="title"]').type('SECOND_TEST_TITLE');
    cy.get('input[name="title"]').should('have.value', 'SECOND_TEST_TITLE');

    // Open issue type dropdown and choose Bug
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]').wait(1000).trigger('mouseover').trigger('click');
    cy.get('[data-testid="icon:bug"]').should('be.visible');

    // Select Pickle Rick from reporter dropdown
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Pickle Rick"]').click();

    // Select Lord Gaben from assignee dropdown
    cy.get('[data-testid="form-field:userIds"]').click();
    cy.get('[data-testid="select-option:Lord Gaben"]').click();

    // Click on button "Create issue"
    cy.get('button[type="submit"]').click();
  });

  // Assert that modal window is closed and successful message is visible
  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  cy.contains('Issue has been successfully created.').should('be.visible');

  // Reload the page to be able to see recently created issue
  // Assert that successful message has disappeared after the reload
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist');

  // Assert than only one list with name Backlog is visible and do steps inside of it
  cy.get('[data-testid="board-list:backlog"]')
    .should('be.visible')
    .and('have.length', '1')
    .within(() => {
      // Assert that this list contains 5 issues (one more than before) and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('SECOND_TEST_TITLE')
        .siblings()
        .within(() => {
          //Assert that correct avatar and type icon are visible
          cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
          cy.get('[data-testid="icon:bug"]').should('be.visible');
        });
    });

  cy.get('[data-testid="board-list:backlog"]')
    .contains('SECOND_TEST_TITLE')
    .within(() => {
      // Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
});


  it('Should create a Task issue with random data and validate it successfully', () => {
    const randomTitle = faker.random.word();
    const randomDescription = faker.random.words(5);

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Fill the description
      cy.get('.ql-editor').type(randomDescription);
      cy.get('.ql-editor').should('have.text', randomDescription);

      // Fill the title
      cy.get('input[name="title"]').type(randomTitle);
      cy.get('input[name="title"]').should('have.value', randomTitle);

      // Verify that the issue type "Task" is already selected
      cy.get('[data-testid="select:type"]').should('have.text', 'Task');

      // Select priority
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      // Select reporter
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Submit the form
      cy.get('button[type="submit"]').click();
    });

    // Ensure the modal is closed
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    
    // Check for the success message
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to verify persistence
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Verify the issue is in the backlog
    cy.get('[data-testid="board-list:backlog"]')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length.greaterThan', 0)
          .first()
          .find('p')
          .contains(randomTitle)
          .siblings()
          .within(() => {
     // Assert that correct avatar and type icon are visible
  cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible');
  cy.get('[data-testid="icon:task"]').should('be.visible');
});
});
});
});