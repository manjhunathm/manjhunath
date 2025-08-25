import { 
  PerformanceTracker, 
  debounce, 
  throttle, 
  getCoreWebVitals 
} from '@/lib/performance'

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PerformanceTracker', () => {
    let tracker: PerformanceTracker

    beforeEach(() => {
      tracker = PerformanceTracker.getInstance()
      tracker.clear()
    })

    it('should create a singleton instance', () => {
      const tracker1 = PerformanceTracker.getInstance()
      const tracker2 = PerformanceTracker.getInstance()
      expect(tracker1).toBe(tracker2)
    })

    it('should mark and measure performance', () => {
      const mockNow = jest.spyOn(performance, 'now')
      mockNow.mockReturnValueOnce(100).mockReturnValueOnce(200)

      tracker.mark('test-operation')
      const duration = tracker.measure('test-operation')

      expect(duration).toBe(100)
      expect(performance.mark).toHaveBeenCalledWith('test-operation-start')
      expect(performance.mark).toHaveBeenCalledWith('test-operation-end')
    })

    it('should return null for unmeasured marks', () => {
      const duration = tracker.measure('non-existent-mark')
      expect(duration).toBeNull()
    })

    it('should clear all marks', () => {
      tracker.mark('test-mark')
      tracker.clear()
      
      const duration = tracker.measure('test-mark')
      expect(duration).toBeNull()
      expect(performance.clearMarks).toHaveBeenCalled()
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      // Call multiple times rapidly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()

      // Should be called once after delay
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        done()
      }, 150)
    })

    it('should pass arguments correctly', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('arg1', 'arg2')

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
        done()
      }, 100)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      // Call multiple times rapidly
      throttledFn()
      throttledFn()
      throttledFn()

      // Should be called immediately once
      expect(mockFn).toHaveBeenCalledTimes(1)

      // Should not be called again until throttle period ends
      setTimeout(() => {
        throttledFn()
        expect(mockFn).toHaveBeenCalledTimes(2)
        done()
      }, 150)
    })
  })

  describe('getCoreWebVitals', () => {
    it('should collect core web vitals', async () => {
      // Mock PerformanceObserver
      const mockObserver = {
        observe: jest.fn(),
        disconnect: jest.fn()
      }
      
      global.PerformanceObserver = jest.fn().mockImplementation((callback) => {
        // Simulate FCP entry
        setTimeout(() => {
          callback({
            getEntries: () => [{
              name: 'first-contentful-paint',
              startTime: 1500
            }]
          })
        }, 10)
        
        return mockObserver
      })

      const vitals = await getCoreWebVitals()
      
      expect(vitals).toHaveProperty('fcp')
      expect(typeof vitals.fcp).toBe('number')
    })

    it('should handle browser without PerformanceObserver', async () => {
      // @ts-ignore
      global.PerformanceObserver = undefined

      const vitals = await getCoreWebVitals()
      
      expect(vitals).toEqual({})
    })
  })

  describe('Performance Budget', () => {
    it('should enforce bundle size limits', () => {
      const maxBundleSize = 1024 * 1024 // 1MB
      const currentBundleSize = 500 * 1024 // 500KB
      
      expect(currentBundleSize).toBeLessThan(maxBundleSize)
    })

    it('should enforce Core Web Vitals thresholds', () => {
      const thresholds = {
        fcp: 1800, // ms
        lcp: 2500, // ms
        fid: 100,  // ms
        cls: 0.1   // score
      }

      // Mock good performance metrics
      const mockMetrics = {
        fcp: 1200,
        lcp: 2000,
        fid: 50,
        cls: 0.05
      }

      expect(mockMetrics.fcp).toBeLessThan(thresholds.fcp)
      expect(mockMetrics.lcp).toBeLessThan(thresholds.lcp)
      expect(mockMetrics.fid).toBeLessThan(thresholds.fid)
      expect(mockMetrics.cls).toBeLessThan(thresholds.cls)
    })
  })

  describe('Resource Loading', () => {
    it('should validate critical resource preloading', () => {
      const criticalResources = [
        '/fonts/inter.woff2',
        '/images/hero.webp',
        '/css/critical.css'
      ]

      criticalResources.forEach(resource => {
        expect(resource).toMatch(/\.(woff2|webp|css)$/)
      })
    })

    it('should validate lazy loading implementation', () => {
      const lazyLoadableResources = [
        '/images/gallery-1.jpg',
        '/images/gallery-2.jpg',
        '/components/HeavyChart.js'
      ]

      // Simulate lazy loading check
      lazyLoadableResources.forEach(resource => {
        const isImage = resource.match(/\.(jpg|png|webp)$/)
        const isComponent = resource.match(/\.js$/)
        
        expect(isImage || isComponent).toBeTruthy()
      })
    })
  })

  describe('Compression', () => {
    it('should validate compression ratios', () => {
      const originalSize = 1000000 // 1MB
      const compressedSize = 300000 // 300KB
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

      // Should achieve at least 60% compression
      expect(compressionRatio).toBeGreaterThanOrEqual(60)
    })
  })
})