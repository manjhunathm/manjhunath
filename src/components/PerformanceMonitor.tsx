'use client'

import { useEffect, memo } from 'react'

const PerformanceMonitor = memo(function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime)
          // In a real app, you'd send this to your analytics service
        }
      })
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any // FID entries have processingStart property
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
        }
      })
      
      try {
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any // CLS entries have hadRecentInput and value properties
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        }
        console.log('CLS:', clsValue)
      })
      
      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as any // Navigation entries have responseStart/requestStart
          console.log('TTFB:', navEntry.responseStart - navEntry.requestStart)
        }
      })
      
      try {
        navigationObserver.observe({ type: 'navigation', buffered: true })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      return () => {
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
        navigationObserver.disconnect()
      }
    }
  }, [])

  return null // This component doesn't render anything
})

export { PerformanceMonitor }