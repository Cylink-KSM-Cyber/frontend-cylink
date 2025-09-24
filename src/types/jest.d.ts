import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveValue(value: string | string[] | number): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveFormValues(expectedValues: Record<string, unknown>): R
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
      toHaveAccessibleDescription(text?: string | RegExp): R
      toHaveAccessibleName(text?: string | RegExp): R
      toHaveDescription(text?: string | RegExp): R
      toHaveRole(role: string, options?: { hidden?: boolean }): R
      toHaveFocus(): R
      toBeVisible(): R
      toBeEmptyDOMElement(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(htmlText: string): R
      toHaveAccessibleErrorMessage(text?: string | RegExp): R
      toHaveStyle(css: string | Record<string, unknown>): R
      toHaveValue(value: string | string[] | number): R
    }
  }
}
