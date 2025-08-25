import { lazy, ComponentType } from 'react'

// Enhanced lazy loading with retry mechanism
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3
): ComponentType<any> {
  return lazy(async () => {
    let lastError: Error | null = null
    
    for (let i = 0; i < retries; i++) {
      try {
        return await importFunc()
      } catch (error) {
        lastError = error as Error
        
        // Wait before retrying (exponential backoff)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
        }
      }
    }
    
    throw lastError
  })
}

// Preload a component
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  // Preload the component when the user hovers or focuses
  const preload = () => {
    importFunc().catch(() => {
      // Ignore preload errors
    })
  }

  // Add event listeners for preloading triggers
  if (typeof window !== 'undefined') {
    document.addEventListener('mouseover', preload, { once: true })
    document.addEventListener('touchstart', preload, { once: true })
    document.addEventListener('focus', preload, { once: true })
  }
}

// Load component on interaction
export function loadOnInteraction<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
) {
  let Component: T | null = null
  let loading = false
  let error: Error | null = null

  const load = async () => {
    if (Component || loading) return Component

    loading = true
    try {
      const module = await importFunc()
      Component = module.default
      return Component
    } catch (err) {
      error = err as Error
      throw error
    } finally {
      loading = false
    }
  }

  return {
    load,
    Component,
    loading,
    error,
    fallback
  }
}

// Intersection Observer based lazy loading
export function createLazyLoader(
  threshold = 0.1,
  rootMargin = '50px'
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const src = target.dataset.src
          const srcset = target.dataset.srcset
          
          if (src && target instanceof HTMLImageElement) {
            target.src = src
            target.removeAttribute('data-src')
          }
          
          if (srcset && target instanceof HTMLImageElement) {
            target.srcset = srcset
            target.removeAttribute('data-srcset')
          }
          
          target.classList.remove('lazy')
          target.classList.add('loaded')
        }
      })
    },
    {
      threshold,
      rootMargin,
    }
  )
}

// Progressive image loading
export interface ProgressiveImageProps {
  src: string
  placeholder?: string
  alt: string
  className?: string
}

export function createProgressiveImage({
  src,
  placeholder,
  alt,
  className = ''
}: ProgressiveImageProps) {
  if (typeof window === 'undefined') {
    return { src, alt, className }
  }

  const img = new Image()
  let loaded = false
  let error = false

  const load = () => {
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        loaded = true
        resolve()
      }
      
      img.onerror = () => {
        error = true
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
    })
  }

  return {
    src: loaded ? src : (placeholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
    alt,
    className: `${className} ${loaded ? 'loaded' : 'loading'}`,
    load,
    loaded,
    error
  }
}