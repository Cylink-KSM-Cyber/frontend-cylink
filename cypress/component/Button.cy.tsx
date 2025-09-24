import React from 'react'
import Button from '../../src/components/atoms/Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    cy.mount(<Button>Click me</Button>)
    cy.get('button').should('contain.text', 'Click me')
  })

  it('renders with primary variant', () => {
    cy.mount(<Button variant='primary'>Primary Button</Button>)
    cy.get('button').should('have.class', 'bg-black')
  })

  it('renders with secondary variant', () => {
    cy.mount(<Button variant='secondary'>Secondary Button</Button>)
    cy.get('button').should('have.class', 'bg-[#F5F5F5]')
  })

  it('renders with outline variant', () => {
    cy.mount(<Button variant='outline'>Outline Button</Button>)
    cy.get('button').should('have.class', 'bg-transparent')
  })

  it('renders with danger variant', () => {
    cy.mount(<Button variant='danger'>Danger Button</Button>)
    cy.get('button').should('have.class', 'bg-[#D32F2F]')
  })

  it('renders with text variant', () => {
    cy.mount(<Button variant='text'>Text Button</Button>)
    cy.get('button').should('have.class', 'bg-transparent')
  })

  it('renders with small size', () => {
    cy.mount(<Button size='sm'>Small Button</Button>)
    cy.get('button').should('have.class', 'px-3')
  })

  it('renders with large size', () => {
    cy.mount(<Button size='lg'>Large Button</Button>)
    cy.get('button').should('have.class', 'px-6')
  })

  it('renders with full width', () => {
    cy.mount(<Button fullWidth>Full Width Button</Button>)
    cy.get('button').should('have.class', 'w-full')
  })

  it('renders as disabled', () => {
    cy.mount(<Button disabled>Disabled Button</Button>)
    cy.get('button').should('be.disabled')
  })

  it('renders with loading state', () => {
    cy.mount(<Button loading>Loading Button</Button>)
    cy.get('button').should('be.disabled')
    cy.get('svg').should('exist') // Loading spinner
  })

  it('handles click events', () => {
    const onClick = cy.stub()
    cy.mount(<Button onClick={onClick}>Clickable Button</Button>)
    cy.get('button').click()
    cy.then(() => {
      expect(onClick).to.have.been.called
    })
  })

  it('renders with start icon', () => {
    const StartIcon = () => <span data-testid='start-icon'>🚀</span>
    cy.mount(<Button startIcon={<StartIcon />}>Button with Icon</Button>)
    cy.get('[data-testid="start-icon"]').should('exist')
  })

  it('renders with end icon', () => {
    const EndIcon = () => <span data-testid='end-icon'>→</span>
    cy.mount(<Button endIcon={<EndIcon />}>Button with Icon</Button>)
    cy.get('[data-testid="end-icon"]').should('exist')
  })

  it('applies custom className', () => {
    cy.mount(<Button className='custom-class'>Custom Button</Button>)
    cy.get('button').should('have.class', 'custom-class')
  })
})
