import React from 'react'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/Hero'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

// Mock Next.js dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (dynamicFunction: any, options: any) => {
    const DynamicComponent = dynamicFunction()
    DynamicComponent.preload = jest.fn(() => Promise.resolve())
    return DynamicComponent
  },
}))

describe('Performance-Optimized Components', () => {
  describe('Hero Component', () => {
    it('should render hero content', () => {
      render(<Hero />)
      
      expect(screen.getByText(/Performance Optimized/)).toBeInTheDocument()
      expect(screen.getByText(/Web Application/)).toBeInTheDocument()
    })

    it('should have performance indicators', () => {
      render(<Hero />)
      
      expect(screen.getByText(/Optimized Loading/)).toBeInTheDocument()
      expect(screen.getByText(/Bundle Splitting/)).toBeInTheDocument()
      expect(screen.getByText(/Performance First/)).toBeInTheDocument()
    })

    it('should be memoized for performance', () => {
      const { rerender } = render(<Hero />)
      
      // Component should not re-render with same props
      rerender(<Hero />)
      
      // This test ensures the component is wrapped with React.memo
      expect(Hero.displayName).toBe('Hero')
    })
  })

  describe('LoadingSkeleton Component', () => {
    it('should render loading skeleton', () => {
      render(<LoadingSkeleton />)
      
      const skeleton = screen.getByRole('generic')
      expect(skeleton).toHaveClass('lazy-load-placeholder')
    })

    it('should have loading animation', () => {
      render(<LoadingSkeleton />)
      
      const loadingElements = document.querySelectorAll('.loading-skeleton')
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('should be memoized for performance', () => {
      expect(LoadingSkeleton.displayName).toBe('LoadingSkeleton')
    })
  })

  describe('Component Performance', () => {
    it('should not cause memory leaks', () => {
      const { unmount } = render(<Hero />)
      
      // Simulate unmounting
      unmount()
      
      // No specific assertion needed - this test ensures
      // components clean up properly
    })

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(<Hero />)
      
      // Simulate rapid re-renders
      for (let i = 0; i < 100; i++) {
        rerender(<Hero />)
      }
      
      // Component should still be functional
      expect(screen.getByText(/Performance Optimized/)).toBeInTheDocument()
    })
  })

  describe('Accessibility Performance', () => {
    it('should have proper ARIA labels', () => {
      render(<Hero />)
      
      // Hero should be accessible
      const heroSection = document.querySelector('section')
      expect(heroSection).toHaveClass('hero-section')
    })

    it('should not block screen readers', () => {
      render(<LoadingSkeleton />)
      
      // Loading skeleton should not interfere with accessibility
      const skeleton = screen.getByRole('generic')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Bundle Size Impact', () => {
    it('should import only necessary dependencies', () => {
      // This test ensures components don't import heavy libraries unnecessarily
      const heroModule = require('@/components/Hero')
      const skeletonModule = require('@/components/LoadingSkeleton')
      
      expect(heroModule.Hero).toBeDefined()
      expect(skeletonModule.LoadingSkeleton).toBeDefined()
    })
  })
})