import { memo } from 'react'

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="lazy-load-placeholder">
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="loading-skeleton h-4 rounded w-3/4"></div>
        <div className="loading-skeleton h-4 rounded w-1/2"></div>
        <div className="loading-skeleton h-4 rounded w-5/6"></div>
        <div className="loading-skeleton h-32 rounded"></div>
      </div>
    </div>
  )
})

export { LoadingSkeleton }