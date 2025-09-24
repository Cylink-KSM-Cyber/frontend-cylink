/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to login with test credentials
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>

      /**
       * Custom command to create a new URL
       * @example cy.createUrl('Test URL', 'https://example.com')
       */
      createUrl(title: string, originalUrl: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('dataCy', value => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('createUrl', (title: string, originalUrl: string) => {
  cy.get('[data-cy="create-url-button"]').click()
  cy.get('input[name="title"]').type(title)
  cy.get('input[name="originalUrl"]').type(originalUrl)
  cy.get('button[type="submit"]').click()
  cy.get('[data-cy="url-created-success"]').should('be.visible')
})
