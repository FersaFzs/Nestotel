// Custom commands for Cypress

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login via Firebase
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

export {};
