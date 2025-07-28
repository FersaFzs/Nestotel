// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
declare const Cypress: any;

Cypress.on('window:before:load', (win: any) => {
  win.fetch = null;
});

// Ignore specific application errors that don't affect functionality
Cypress.on('uncaught:exception', (err: Error, runnable: any) => {
  // Ignore hydration errors from React
  if (err.message.includes('Hydration failed')) {
    return false;
  }

  // Ignore GSAP-related errors in tests
  if (err.message.includes('ScrollTrigger') || err.message.includes('gsap')) {
    return false;
  }

  // Allow other errors to cause test failures
  return true;
});
