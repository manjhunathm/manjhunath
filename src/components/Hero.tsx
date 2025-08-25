import { memo } from 'react'

const Hero = memo(function Hero() {
  return (
    <section className="hero-section">
      <div className="container text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Performance Optimized
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
            Web Application
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
          Demonstrating comprehensive performance optimizations including bundle size reduction, 
          load time improvements, and modern web performance best practices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400">⚡</div>
            <div className="text-sm">Optimized Loading</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">📦</div>
            <div className="text-sm">Bundle Splitting</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-400">🚀</div>
            <div className="text-sm">Performance First</div>
          </div>
        </div>
      </div>
    </section>
  )
})

export { Hero }