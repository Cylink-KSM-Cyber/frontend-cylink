describe('Dashboard Functionality', () => {
  beforeEach(() => {
    // Mock successful login and dashboard data
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { success: true, token: 'mock-token' }
    }).as('loginRequest')

    cy.intercept('GET', '/api/urls', {
      statusCode: 200,
      body: {
        urls: [
          {
            id: '1',
            title: 'Test URL 1',
            short_url: 'abc123',
            original_url: 'https://example.com',
            clicks: 10,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            title: 'Test URL 2',
            short_url: 'def456',
            original_url: 'https://google.com',
            clicks: 5,
            created_at: '2024-01-02T00:00:00Z'
          }
        ]
      }
    }).as('getUrls')

    cy.intercept('GET', '/api/analytics', {
      statusCode: 200,
      body: {
        totalClicks: 15,
        totalUrls: 2,
        clicksOverTime: [],
        deviceBreakdown: [],
        browserStats: [],
        geoDistribution: []
      }
    }).as('getAnalytics')
  })

  it('should display dashboard after login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Check dashboard elements
    cy.contains('Dashboard').should('be.visible')
    cy.get('[data-cy="create-url-button"]').should('be.visible')
  })

  it('should display URL list', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.wait('@getUrls')

    // Check URL list
    cy.contains('Test URL 1').should('be.visible')
    cy.contains('Test URL 2').should('be.visible')
    cy.contains('abc123').should('be.visible')
    cy.contains('def456').should('be.visible')
  })

  it('should display analytics data', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.wait('@getAnalytics')

    // Check analytics elements
    cy.contains('Total Clicks').should('be.visible')
    cy.contains('Total URLs').should('be.visible')
  })

  it('should navigate to URL details', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.wait('@getUrls')

    // Click on first URL
    cy.contains('Test URL 1').click()
    cy.url().should('include', '/dashboard/urls/1')
  })
})
