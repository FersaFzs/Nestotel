describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('GRANADA INN').should('be.visible');
    cy.contains('una').should('be.visible');
    cy.contains('experiencia').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.contains('Iniciar Sesión').click();
    cy.url().should('include', '/login');
    cy.contains('Bienvenido de vuelta').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.contains('Registrarse').click();
    cy.url().should('include', '/register');
    cy.contains('Únete a nosotros').should('be.visible');
  });

  it('should navigate between login and register', () => {
    cy.visit('/login');
    cy.contains('Regístrate aquí').click();
    cy.url().should('include', '/register');

    cy.contains('Inicia sesión aquí').click();
    cy.url().should('include', '/login');
  });

  it('should navigate back to homepage from auth pages', () => {
    cy.visit('/login');
    cy.contains('GRANADA INN').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
