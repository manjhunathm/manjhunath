import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Hero } from '@/components/Hero'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

// Lazy load components for better performance
const PerformanceMetrics = dynamic(() => import('@/components/PerformanceMetrics'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Client-side only for performance metrics
})

const OptimizationFeatures = dynamic(() => import('@/components/OptimizationFeatures'), {
  loading: () => <LoadingSkeleton />,
})

const BundleAnalysis = dynamic(() => import('@/components/BundleAnalysis'), {
  loading: () => <LoadingSkeleton />,
})

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Above-the-fold content - loaded immediately */}
      <Hero />
      
      {/* Below-the-fold content - lazy loaded */}
      <Suspense fallback={<LoadingSkeleton />}>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Performance Optimizations Implemented
            </h2>
            <OptimizationFeatures />
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Real-time Performance Metrics
            </h2>
            <PerformanceMetrics />
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Bundle Analysis
            </h2>
            <BundleAnalysis />
          </div>
        </section>
      </Suspense>
    </main>
  )
}