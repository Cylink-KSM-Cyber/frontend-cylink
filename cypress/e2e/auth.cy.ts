describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display login form on home page', () => {
    cy.get('a[href="/login"]').should('be.visible')
    cy.get('a[href="/register"]').should('be.visible')
  })

  it('should navigate to login page', () => {
    cy.get('a[href="/login"]').click()
    cy.url().should('include', '/login')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should navigate to register page', () => {
    cy.get('a[href="/register"]').click()
    cy.url().should('include', '/register')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should show validation errors for empty form', () => {
    cy.visit('/login')
    cy.get('button[type="submit"]').click()

    // Check for validation messages
    cy.get('input[type="email"]').should('have.attr', 'required')
    cy.get('input[type="password"]').should('have.attr', 'required')
  })

  it('should show validation error for invalid email', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check for email validation error
    cy.contains('Please enter a valid email address').should('be.visible')
  })

  it('should show validation error for short password', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('123')
    cy.get('button[type="submit"]').click()

    // Check for password validation error
    cy.contains('Password must be at least 8 characters').should('be.visible')
  })
})
