#!/bin/bash

# Performance-Optimized Web Application Setup Script

set -e

echo "🚀 Setting up Performance-Optimized Web Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or later is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/images
mkdir -p .lighthouseci
mkdir -p analyze

echo "✅ Directories created"

# Build the application to check everything works
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --passWithNoTests

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "⚠️ Some tests failed, but continuing setup"
fi

# Display setup completion message
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 Quick start commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run analyze      - Analyze bundle size"
echo "  npm run lighthouse   - Run performance audit"
echo "  npm test             - Run tests"
echo ""
echo "📚 Documentation:"
echo "  README.md            - Project overview and quick start"
echo "  PERFORMANCE_GUIDE.md - Comprehensive performance guide"
echo ""
echo "🌐 Development server will be available at: http://localhost:3000"
echo ""
echo "Happy coding! 🎯"