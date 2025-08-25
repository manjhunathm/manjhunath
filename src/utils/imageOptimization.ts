// Image optimization utilities

export interface ImageOptimizationOptions {
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  width?: number
  height?: number
  blur?: boolean
  progressive?: boolean
}

// Generate optimized image URL (for Next.js Image component)
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  if (typeof window === 'undefined') return src

  const {
    quality = 75,
    format = 'webp',
    width,
    height,
    blur = false,
    progressive = true
  } = options

  const params = new URLSearchParams()
  
  if (quality) params.set('q', quality.toString())
  if (format) params.set('f', format)
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (blur) params.set('blur', '5')
  if (progressive) params.set('progressive', 'true')

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

// Generate responsive image sources
export function generateResponsiveSources(
  src: string,
  breakpoints: number[] = [640, 768, 1024, 1280, 1536]
): Array<{ srcSet: string; media: string }> {
  return breakpoints.map((breakpoint, index) => ({
    srcSet: getOptimizedImageUrl(src, { width: breakpoint }),
    media: index === breakpoints.length - 1 
      ? `(min-width: ${breakpoints[index - 1] || 0}px)`
      : `(max-width: ${breakpoint}px)`
  }))
}

// Create blur placeholder for images
export function createBlurPlaceholder(width = 10, height = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''

  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

// Convert image to WebP format (client-side)
export function convertToWebP(
  file: File,
  quality = 0.8
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(resolve, 'image/webp', quality)
      } else {
        resolve(null)
      }
    }

    img.onerror = () => resolve(null)
    img.src = URL.createObjectURL(file)
  })
}

// Check if WebP is supported
export function isWebPSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// Check if AVIF is supported
export function isAVIFSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    const avif = new Image()
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2)
    }
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI='
  })
}

// Get the best supported image format
export async function getBestImageFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  if (await isAVIFSupported()) return 'avif'
  if (await isWebPSupported()) return 'webp'
  return 'jpeg'
}

// Calculate image dimensions while maintaining aspect ratio
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) {
    return { width: originalWidth, height: originalHeight }
  }

  const aspectRatio = originalWidth / originalHeight

  if (maxWidth && maxHeight) {
    const widthFromHeight = maxHeight * aspectRatio
    const heightFromWidth = maxWidth / aspectRatio

    if (widthFromHeight <= maxWidth) {
      return { width: widthFromHeight, height: maxHeight }
    } else {
      return { width: maxWidth, height: heightFromWidth }
    }
  }

  if (maxWidth) {
    return { width: maxWidth, height: maxWidth / aspectRatio }
  }

  if (maxHeight) {
    return { width: maxHeight * aspectRatio, height: maxHeight }
  }

  return { width: originalWidth, height: originalHeight }
}

// Generate image sizes attribute for responsive images
export function generateImageSizes(
  breakpoints: Array<{ breakpoint: number; width: string }> = [
    { breakpoint: 640, width: '100vw' },
    { breakpoint: 768, width: '50vw' },
    { breakpoint: 1024, width: '33vw' },
    { breakpoint: 1280, width: '25vw' }
  ]
): string {
  return breakpoints
    .sort((a, b) => a.breakpoint - b.breakpoint)
    .map((bp, index) => {
      if (index === breakpoints.length - 1) {
        return bp.width
      }
      return `(max-width: ${bp.breakpoint}px) ${bp.width}`
    })
    .join(', ')
}

// Preload critical images
export function preloadImage(src: string, priority = false): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  
  if (priority) {
    link.setAttribute('fetchpriority', 'high')
  }

  document.head.appendChild(link)
}

// Lazy load images with intersection observer
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    img.src = src
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement
          target.src = src
          target.classList.remove('lazy')
          target.classList.add('loaded')
          observer.unobserve(target)
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    }
  )

  observer.observe(img)
}