'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export function usePerformanceMetrics(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
      }
    })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
      }
    })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any // FID entries have processingStart property
        const fid = fidEntry.processingStart - fidEntry.startTime
        setMetrics(prev => ({ ...prev, fid }))
      }
    })

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as any // CLS entries have hadRecentInput and value properties
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }))
    })

    // Time to First Byte
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as any // Navigation entries have responseStart/requestStart
        const ttfb = navEntry.responseStart - navEntry.requestStart
        setMetrics(prev => ({ ...prev, ttfb }))
      }
    })

    // Register observers with error handling
    try {
      fcpObserver.observe({ type: 'paint', buffered: true })
    } catch (e) {
      console.warn('FCP observer not supported')
    }

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (e) {
      console.warn('LCP observer not supported')
    }

    try {
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (e) {
      console.warn('FID observer not supported')
    }

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch (e) {
      console.warn('CLS observer not supported')
    }

    try {
      navigationObserver.observe({ type: 'navigation', buffered: true })
    } catch (e) {
      console.warn('Navigation observer not supported')
    }

    // Fallback for browsers without PerformanceObserver
    const fallbackTimeout = setTimeout(() => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const ttfb = timing.responseStart - timing.requestStart
        setMetrics(prev => ({ ...prev, ttfb }))
      }
    }, 1000)

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      navigationObserver.disconnect()
      clearTimeout(fallbackTimeout)
    }
  }, [])

  return metrics
}