describe('URL Management Flow', () => {
  beforeEach(() => {
    // Mock successful login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { success: true, token: 'mock-token' }
    }).as('loginRequest')

    cy.intercept('GET', '/api/urls', {
      statusCode: 200,
      body: { urls: [] }
    }).as('getUrls')

    cy.intercept('POST', '/api/urls', {
      statusCode: 201,
      body: {
        success: true,
        url: {
          id: '1',
          title: 'Test URL',
          short_url: 'abc123',
          original_url: 'https://example.com',
          created_at: new Date().toISOString()
        }
      }
    }).as('createUrl')
  })

  it('should create a new URL successfully', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create URL button
    cy.get('[data-cy="create-url-button"]').click()

    // Fill form
    cy.get('input[name="title"]').type('Test URL')
    cy.get('input[name="originalUrl"]').type('https://example.com')
    cy.get('input[name="expiryDate"]').type('2025-12-31')

    // Submit form
    cy.get('button[type="submit"]').click()

    cy.wait('@createUrl')
    cy.contains('URL created successfully').should('be.visible')
  })

  it('should show validation errors for invalid URL', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create URL button
    cy.get('[data-cy="create-url-button"]').click()

    // Fill form with invalid URL
    cy.get('input[name="title"]').type('Test URL')
    cy.get('input[name="originalUrl"]').type('invalid-url')
    cy.get('button[type="submit"]').click()

    // Check for validation error
    cy.contains('Please enter a valid URL').should('be.visible')
  })

  it('should show validation error for empty title', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create URL button
    cy.get('[data-cy="create-url-button"]').click()

    // Fill form without title
    cy.get('input[name="originalUrl"]').type('https://example.com')
    cy.get('button[type="submit"]').click()

    // Check for validation error
    cy.contains('Title is required').should('be.visible')
  })
})
