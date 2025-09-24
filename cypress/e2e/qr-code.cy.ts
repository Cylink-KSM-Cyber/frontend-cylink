describe('QR Code Generation', () => {
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

    cy.intercept('POST', '/api/qr-codes', {
      statusCode: 201,
      body: {
        success: true,
        qrCode: {
          id: '1',
          url_id: '1',
          qr_code_url: 'data:image/png;base64,mock-qr-code-data'
        }
      }
    }).as('createQrCode')
  })

  it('should generate QR code for URL', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create QR code button
    cy.get('[data-cy="create-qr-button"]').click()

    // Select URL
    cy.get('select[name="urlId"]').select('1')

    // Customize QR code
    cy.get('input[name="foregroundColor"]').type('#000000')
    cy.get('input[name="backgroundColor"]').type('#FFFFFF')
    cy.get('input[name="logoSize"]').type('0.3')

    // Generate QR code
    cy.get('button[type="submit"]').click()

    cy.wait('@createQrCode')
    cy.contains('QR Code generated successfully').should('be.visible')
  })

  it('should show QR code preview', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create QR code button
    cy.get('[data-cy="create-qr-button"]').click()

    // Select URL
    cy.get('select[name="urlId"]').select('1')

    // Generate QR code
    cy.get('button[type="submit"]').click()

    cy.wait('@createQrCode')

    // Check QR code preview
    cy.get('[data-cy="qr-code-preview"]').should('be.visible')
    cy.get('[data-cy="qr-code-image"]').should('be.visible')
  })

  it('should allow QR code download', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Click create QR code button
    cy.get('[data-cy="create-qr-button"]').click()

    // Select URL
    cy.get('select[name="urlId"]').select('1')

    // Generate QR code
    cy.get('button[type="submit"]').click()

    cy.wait('@createQrCode')

    // Check download buttons
    cy.get('[data-cy="download-png"]').should('be.visible')
    cy.get('[data-cy="download-svg"]').should('be.visible')
  })
})
