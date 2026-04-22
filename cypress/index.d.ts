/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    checkAccessibility(context?: string | Node | JQueryWithSelector): Chainable<void>;
  }
}
