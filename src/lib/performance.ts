// Performance utility functions

export interface PerformanceEntry {
  name: string
  startTime: number
  duration: number
}

export class PerformanceTracker {
  private static instance: PerformanceTracker
  private marks: Map<string, number> = new Map()

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker()
    }
    return PerformanceTracker.instance
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      const timestamp = window.performance.now()
      this.marks.set(name, timestamp)
      
      // Also use the Performance API if available
      if (window.performance.mark) {
        window.performance.mark(`${name}-start`)
      }
    }
  }

  // Measure the time since a mark was set
  measure(name: string): number | null {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = this.marks.get(name)
      if (startTime) {
        const duration = window.performance.now() - startTime
        
        // Use Performance API if available
        if (window.performance.mark && window.performance.measure) {
          window.performance.mark(`${name}-end`)
          window.performance.measure(name, `${name}-start`, `${name}-end`)
        }
        
        this.marks.delete(name)
        return duration
      }
    }
    return null
  }

  // Get all performance entries
  getEntries(): PerformanceEntry[] {
    if (typeof window !== 'undefined' && window.performance && window.performance.getEntriesByType) {
      return window.performance.getEntriesByType('measure').map(entry => ({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration
      }))
    }
    return []
  }

  // Clear all marks and measures
  clear(): void {
    this.marks.clear()
    if (typeof window !== 'undefined' && window.performance && window.performance.clearMarks) {
      window.performance.clearMarks()
      window.performance.clearMeasures()
    }
  }
}

// Utility function to measure component render time
export function measureRender<T>(
  componentName: string,
  renderFunction: () => T
): T {
  const tracker = PerformanceTracker.getInstance()
  tracker.mark(`render-${componentName}`)
  
  try {
    const result = renderFunction()
    const duration = tracker.measure(`render-${componentName}`)
    
    if (duration && process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    tracker.measure(`render-${componentName}`) // Clean up mark
    throw error
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  })
}

// Preload resources
export function preloadResource(href: string, as: string, type?: string): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type
  
  document.head.appendChild(link)
}

// Prefetch resources
export function prefetchResource(href: string): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  
  document.head.appendChild(link)
}

// Get Core Web Vitals
export interface CoreWebVitals {
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
}

export function getCoreWebVitals(): Promise<CoreWebVitals> {
  return new Promise((resolve) => {
    const vitals: CoreWebVitals = {}
    let pendingMetrics = 5

    const checkComplete = () => {
      pendingMetrics--
      if (pendingMetrics === 0) {
        resolve(vitals)
      }
    }

    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      resolve(vitals)
      return
    }

    // FCP
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime
            fcpObserver.disconnect()
            checkComplete()
            break
          }
        }
      })
      fcpObserver.observe({ type: 'paint', buffered: true })
    } catch {
      checkComplete()
    }

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = lastEntry.startTime
        lcpObserver.disconnect()
        checkComplete()
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      checkComplete()
    }

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any // FID entries have processingStart property
          vitals.fid = fidEntry.processingStart - fidEntry.startTime
          fidObserver.disconnect()
          checkComplete()
          break
        }
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch {
      checkComplete()
    }

    // CLS
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any // CLS entries have hadRecentInput and value properties
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        }
        vitals.cls = clsValue
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      
      // Stop observing after 5 seconds
      setTimeout(() => {
        clsObserver.disconnect()
        checkComplete()
      }, 5000)
    } catch {
      checkComplete()
    }

    // TTFB
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as any // Navigation entries have responseStart/requestStart
          vitals.ttfb = navEntry.responseStart - navEntry.requestStart
          navigationObserver.disconnect()
          checkComplete()
          break
        }
      })
      navigationObserver.observe({ type: 'navigation', buffered: true })
    } catch {
      checkComplete()
    }
  })
}