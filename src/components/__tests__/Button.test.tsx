import { render, screen } from '@testing-library/react'
import Button from '@/components/atoms/Button'

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant='primary'>Primary Button</Button>)
    const button = screen.getByText('Primary Button')
    expect(button).toHaveClass('bg-black')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')
    expect(button).toBeDisabled()
  })
})
