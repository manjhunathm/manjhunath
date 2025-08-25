import '@testing-library/jest-dom'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (dynamicFunction, options) => {
    const DynamicComponent = dynamicFunction()
    DynamicComponent.preload = jest.fn(() => Promise.resolve())
    DynamicComponent.render.preload = jest.fn(() => Promise.resolve())
    return DynamicComponent
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    timing: {
      requestStart: 0,
      responseStart: 100,
    },
  },
  writable: true,
})

// Mock CompressionStream for browsers that don't support it
global.CompressionStream = jest.fn(() => ({
  writable: {
    getWriter: jest.fn(() => ({
      write: jest.fn(),
      close: jest.fn(),
    })),
  },
  readable: {
    getReader: jest.fn(() => ({
      read: jest.fn(() => Promise.resolve({ done: true, value: new Uint8Array() })),
    })),
  },
}))

// Silence console.warn during tests
const originalWarn = console.warn
beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = originalWarn
})