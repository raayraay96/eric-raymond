#!/bin/bash

# Smart Error Detection and Auto-Fix Script
# This script analyzes build errors and applies targeted fixes

set -e

echo "🤖 Smart Auto-Fix Bot Starting..."

# Function to apply React version fixes
fix_react_version() {
    echo "🔧 Applying React version fix..."
    npm install react@^18.3.1 react-dom@^18.3.1 @types/react@^18.3.12 @types/react-dom@^18.3.1 --save-exact
    echo "✅ React version fixed"
}

# Function to fix Three.js issues
fix_threejs_issues() {
    echo "🔧 Applying Three.js compatibility fixes..."
    npm install @react-three/fiber@^8.15.0 @react-three/drei@^9.100.0 three@^0.165.0 --save
    echo "✅ Three.js compatibility fixed"
}

# Function to fix TypeScript configuration
fix_typescript_config() {
    echo "🔧 Fixing TypeScript configuration..."
    
    # Update tsconfig.json
    if [ -f "tsconfig.json" ]; then
        sed -i 's/"strict": true/"strict": true,\n    "skipLibCheck": true/' tsconfig.json
    fi
    
    # Update tsconfig.app.json  
    if [ -f "tsconfig.app.json" ]; then
        sed -i 's/"strict": true/"strict": true,\n    "skipLibCheck": true/' tsconfig.app.json
    fi
    
    echo "✅ TypeScript configuration fixed"
}

# Function to fix Vite configuration
fix_vite_config() {
    echo "🔧 Updating Vite configuration..."
    
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/eric-raymond/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  define: {
    global: 'globalThis',
  }
});
EOF
    
    echo "✅ Vite configuration updated"
}

# Function to analyze error logs and determine fixes
analyze_and_fix() {
    local error_log="$1"
    local fixes_applied=""
    
    echo "📋 Analyzing error log: $error_log"
    
    if [ -f "$error_log" ]; then
        # Check for React version conflicts
        if grep -q "peer react.*<19.*>=18\|ERESOLVE.*react" "$error_log"; then
            fix_react_version
            fixes_applied="${fixes_applied}- Fixed React version compatibility\n"
        fi
        
        # Check for Three.js issues
        if grep -q "@react-three\|three.js" "$error_log"; then
            fix_threejs_issues
            fixes_applied="${fixes_applied}- Fixed Three.js dependencies\n"
        fi
        
        # Check for TypeScript errors
        if grep -q "TypeScript error\|TS[0-9]\+:" "$error_log"; then
            fix_typescript_config
            fixes_applied="${fixes_applied}- Updated TypeScript configuration\n"
        fi
        
        # Check for Vite build issues
        if grep -q "vite.*error\|build.*failed" "$error_log"; then
            fix_vite_config
            fixes_applied="${fixes_applied}- Updated Vite configuration\n"
        fi
        
        # Check for peer dependency issues
        if grep -q "peer dep\|peerDependencies" "$error_log"; then
            echo "🔧 Installing with legacy peer deps..."
            rm -rf node_modules package-lock.json
            npm install --legacy-peer-deps
            fixes_applied="${fixes_applied}- Resolved peer dependency conflicts\n"
        fi
    fi
    
    echo -e "$fixes_applied"
}

# Main execution
cd frontend

# Try initial install and build
echo "🚀 Attempting initial build..."
if npm ci && npm run build; then
    echo "✅ Build successful on first attempt!"
    exit 0
else
    echo "❌ Initial build failed - applying auto-fixes..."
    
    # Capture errors
    npm ci 2>&1 | tee /tmp/npm-error.log || true
    npm run build 2>&1 | tee /tmp/build-error.log || true
    
    # Analyze and apply fixes
    fixes=$(analyze_and_fix "/tmp/npm-error.log")
    more_fixes=$(analyze_and_fix "/tmp/build-error.log")
    
    # Combine all fixes
    all_fixes="${fixes}${more_fixes}"
    
    # Retry build
    echo "🔄 Retrying build after fixes..."
    if npm ci && npm run build; then
        echo "✅ Build successful after auto-fixes!"
        echo "🎉 Applied fixes:"
        echo -e "$all_fixes"
        
        # Save fix summary for GitHub
        echo -e "$all_fixes" > /tmp/auto-fixes.txt
        echo "AUTO_FIXES_APPLIED=true" >> $GITHUB_ENV
        echo "FIXES_SUMMARY<<EOF" >> $GITHUB_ENV
        echo -e "$all_fixes" >> $GITHUB_ENV
        echo "EOF" >> $GITHUB_ENV
    else
        echo "❌ Build still failing after auto-fixes"
        echo "🔧 Manual intervention required"
        exit 1
    fi
fi