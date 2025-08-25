'use client'

import { useState, useEffect, memo } from 'react'
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics'

const PerformanceMetrics = memo(function PerformanceMetrics() {
  const metrics = usePerformanceMetrics()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="loading-skeleton h-64 rounded"></div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="First Contentful Paint"
        value={metrics.fcp}
        unit="ms"
        description="Time until first content is painted"
        threshold={1800}
      />
      <MetricCard
        title="Largest Contentful Paint"
        value={metrics.lcp}
        unit="ms"
        description="Time until largest content is painted"
        threshold={2500}
      />
      <MetricCard
        title="First Input Delay"
        value={metrics.fid}
        unit="ms"
        description="Delay between first user input and response"
        threshold={100}
      />
      <MetricCard
        title="Cumulative Layout Shift"
        value={metrics.cls}
        unit=""
        description="Measure of visual stability"
        threshold={0.1}
      />
    </div>
  )
})

const MetricCard = memo(function MetricCard({
  title,
  value,
  unit,
  description,
  threshold
}: {
  title: string
  value: number | null
  unit: string
  description: string
  threshold: number
}) {
  const getScoreColor = (value: number | null, threshold: number) => {
    if (value === null) return 'text-gray-400'
    return value <= threshold ? 'text-green-500' : 'text-red-500'
  }

  const getScoreLabel = (value: number | null, threshold: number) => {
    if (value === null) return 'Measuring...'
    return value <= threshold ? 'Good' : 'Needs Improvement'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-3xl font-bold ${getScoreColor(value, threshold)}`}>
          {value !== null ? value.toFixed(unit === 'ms' ? 0 : 3) : '--'}
        </span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className={`text-xs font-medium ${getScoreColor(value, threshold)}`}>
        {getScoreLabel(value, threshold)}
      </div>
    </div>
  )
})

export default PerformanceMetrics