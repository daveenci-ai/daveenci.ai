#!/bin/bash
# Build for production

echo "🏗️  Building DaVeenci for Production..."
echo ""

# Build frontend
echo "📦 Building web app..."
cd apps/web && npm run build

echo ""
echo "✅ Build complete!"
echo "📁 Output: apps/web/dist/"
