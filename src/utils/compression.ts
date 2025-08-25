// Utility functions for compression and optimization

// Check if compression is supported
export function isCompressionSupported(): boolean {
  return typeof window !== 'undefined' && 'CompressionStream' in window
}

// Simple text compression simulation (for demonstration)
export async function compressText(text: string): Promise<Uint8Array> {
  // For now, just return the encoded text since browser compression APIs are complex
  return new TextEncoder().encode(text)
}

// Simple text decompression simulation (for demonstration)
export async function decompressText(compressed: Uint8Array): Promise<string> {
  // For now, just decode the text
  return new TextDecoder().decode(compressed)
}

// Minify CSS (basic implementation)
export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
    .replace(/\s*{\s*/g, '{') // Clean up braces
    .replace(/}\s*/g, '}')
    .replace(/;\s*/g, ';')
    .replace(/,\s*/g, ',')
    .replace(/:\s*/g, ':')
    .trim()
}

// Minify JavaScript (basic implementation)
export function minifyJS(js: string): string {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Clean up semicolons
    .replace(/\s*{\s*/g, '{')
    .replace(/}\s*/g, '}')
    .replace(/;\s*/g, ';')
    .replace(/,\s*/g, ',')
    .trim()
}

// Calculate compression ratio
export function calculateCompressionRatio(original: number, compressed: number): number {
  return ((original - compressed) / original) * 100
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Estimate bundle size reduction techniques
export interface BundleOptimization {
  technique: string
  description: string
  estimatedSavings: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const bundleOptimizations: BundleOptimization[] = [
  {
    technique: 'Tree Shaking',
    description: 'Remove unused code from bundles',
    estimatedSavings: '20-40%',
    difficulty: 'easy'
  },
  {
    technique: 'Code Splitting',
    description: 'Split code into smaller chunks',
    estimatedSavings: '30-50%',
    difficulty: 'medium'
  },
  {
    technique: 'Dynamic Imports',
    description: 'Load modules on demand',
    estimatedSavings: '40-60%',
    difficulty: 'medium'
  },
  {
    technique: 'Compression',
    description: 'Gzip/Brotli compression',
    estimatedSavings: '60-80%',
    difficulty: 'easy'
  },
  {
    technique: 'Minification',
    description: 'Remove whitespace and comments',
    estimatedSavings: '10-20%',
    difficulty: 'easy'
  },
  {
    technique: 'Bundle Analysis',
    description: 'Identify and remove duplicate dependencies',
    estimatedSavings: '15-30%',
    difficulty: 'medium'
  }
]

// Estimate load time based on file size and connection speed
export function estimateLoadTime(fileSizeBytes: number, connectionSpeedMbps = 10): number {
  const fileSizeMb = fileSizeBytes / (1024 * 1024)
  return (fileSizeMb / connectionSpeedMbps) * 1000 // Return in milliseconds
}