'use client'

import { useState, useEffect, memo } from 'react'

interface BundleStats {
  totalSize: number
  gzippedSize: number
  chunks: Array<{
    name: string
    size: number
    gzipped: number
  }>
}

const BundleAnalysis = memo(function BundleAnalysis() {
  const [bundleStats, setBundleStats] = useState<BundleStats | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Simulate bundle analysis data
    // In a real app, this would come from your build process
    setBundleStats({
      totalSize: 245000, // 245KB
      gzippedSize: 85000, // 85KB
      chunks: [
        { name: 'main', size: 120000, gzipped: 42000 },
        { name: 'vendor', size: 95000, gzipped: 32000 },
        { name: 'common', size: 20000, gzipped: 7000 },
        { name: 'runtime', size: 10000, gzipped: 4000 },
      ]
    })
  }, [])

  if (!isClient || !bundleStats) {
    return <div className="loading-skeleton h-64 rounded"></div>
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const compressionRatio = ((bundleStats.totalSize - bundleStats.gzippedSize) / bundleStats.totalSize * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Bundle Size</h3>
          <div className="text-3xl font-bold text-blue-600">{formatSize(bundleStats.totalSize)}</div>
          <p className="text-sm text-gray-500 mt-1">Uncompressed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gzipped Size</h3>
          <div className="text-3xl font-bold text-green-600">{formatSize(bundleStats.gzippedSize)}</div>
          <p className="text-sm text-gray-500 mt-1">Compressed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Compression Ratio</h3>
          <div className="text-3xl font-bold text-purple-600">{compressionRatio}%</div>
          <p className="text-sm text-gray-500 mt-1">Size reduction</p>
        </div>
      </div>

      {/* Chunk Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Chunk Breakdown</h3>
        <div className="space-y-4">
          {bundleStats.chunks.map((chunk, index) => {
            const percentage = (chunk.size / bundleStats.totalSize * 100).toFixed(1)
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{chunk.name}.js</span>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{formatSize(chunk.size)}</span>
                    <span className="text-green-600">({formatSize(chunk.gzipped)} gzipped)</span>
                    <span className="text-blue-600">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Optimization Recommendations</h3>
        <div className="space-y-3">
          <RecommendationItem
            status="good"
            title="Bundle size is optimized"
            description="Total bundle size is under 250KB, which is excellent for initial load performance."
          />
          <RecommendationItem
            status="good"
            title="Good compression ratio"
            description={`${compressionRatio}% compression ratio indicates effective gzip compression.`}
          />
          <RecommendationItem
            status="warning"
            title="Consider code splitting"
            description="The main chunk could be further split to improve caching and parallel loading."
          />
          <RecommendationItem
            status="good"
            title="Vendor chunk separated"
            description="Third-party libraries are properly separated for better caching."
          />
        </div>
      </div>
    </div>
  )
})

const RecommendationItem = memo(function RecommendationItem({
  status,
  title,
  description
}: {
  status: 'good' | 'warning' | 'error'
  title: string
  description: string
}) {
  const statusConfig = {
    good: { icon: '✅', color: 'text-green-600' },
    warning: { icon: '⚠️', color: 'text-yellow-600' },
    error: { icon: '❌', color: 'text-red-600' }
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-xl">{config.icon}</span>
      <div>
        <h4 className={`font-medium ${config.color}`}>{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  )
})

export default BundleAnalysis