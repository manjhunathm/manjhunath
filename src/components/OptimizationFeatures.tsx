import { memo } from 'react'

const optimizations = [
  {
    title: 'Code Splitting',
    description: 'Dynamic imports and route-based code splitting to reduce initial bundle size',
    icon: '📦',
    techniques: ['Dynamic imports', 'Route-based splitting', 'Component lazy loading']
  },
  {
    title: 'Image Optimization',
    description: 'Modern image formats, lazy loading, and responsive images',
    icon: '🖼️',
    techniques: ['WebP/AVIF formats', 'Lazy loading', 'Responsive sizing', 'Blur placeholders']
  },
  {
    title: 'Bundle Optimization',
    description: 'Tree shaking, minification, and compression for smaller bundles',
    icon: '🌳',
    techniques: ['Tree shaking', 'Minification', 'Gzip/Brotli compression', 'Dead code elimination']
  },
  {
    title: 'Caching Strategy',
    description: 'Aggressive caching with proper cache invalidation',
    icon: '💾',
    techniques: ['Static asset caching', 'API response caching', 'Service worker', 'CDN integration']
  },
  {
    title: 'Critical CSS',
    description: 'Inline critical CSS and defer non-critical styles',
    icon: '🎨',
    techniques: ['Above-fold CSS inline', 'Deferred loading', 'CSS purging', 'Font optimization']
  },
  {
    title: 'Resource Hints',
    description: 'Preload, prefetch, and preconnect for faster resource loading',
    icon: '🔗',
    techniques: ['DNS prefetch', 'Resource preload', 'Link prefetch', 'Preconnect']
  },
  {
    title: 'Performance Monitoring',
    description: 'Real-time monitoring of Core Web Vitals and performance metrics',
    icon: '📊',
    techniques: ['Core Web Vitals', 'Real User Monitoring', 'Performance API', 'Analytics integration']
  },
  {
    title: 'Server Optimization',
    description: 'Server-side rendering and static generation for faster initial loads',
    icon: '⚡',
    techniques: ['SSR/SSG', 'Edge functions', 'API optimization', 'Database optimization']
  }
]

const OptimizationFeatures = memo(function OptimizationFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {optimizations.map((optimization, index) => (
        <OptimizationCard key={index} {...optimization} />
      ))}
    </div>
  )
})

const OptimizationCard = memo(function OptimizationCard({
  title,
  description,
  icon,
  techniques
}: {
  title: string
  description: string
  icon: string
  techniques: string[]
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      <div className="space-y-1">
        {techniques.map((technique, index) => (
          <div key={index} className="flex items-center text-xs text-gray-500">
            <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
            {technique}
          </div>
        ))}
      </div>
    </div>
  )
})

export default OptimizationFeatures