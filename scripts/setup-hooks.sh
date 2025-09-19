#!/bin/bash

# Git Hooks Setup Script
# This script copies git hooks to .git/hooks/ directory to ensure
# all team members use the same commit rules and validations

echo "🔧 Setting up Git hooks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a Git repository root directory"
    echo "   Please run this script from the repository root"
    exit 1
fi

# Check if hooks directory exists
if [ ! -d "scripts/hooks" ]; then
    echo "❌ Error: scripts/hooks directory not found"
    echo "   Please ensure the scripts/hooks directory exists with the hook files"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# List of hooks to install
hooks=("pre-commit" "commit-msg" "pre-push")

# Copy and set permissions for each hook
for hook in "${hooks[@]}"; do
    if [ -f "scripts/hooks/$hook" ]; then
        echo "📋 Installing $hook hook..."
        cp "scripts/hooks/$hook" ".git/hooks/$hook"
        chmod +x ".git/hooks/$hook"
        echo "✅ $hook hook installed successfully"
    else
        echo "⚠️  Warning: scripts/hooks/$hook not found, skipping..."
    fi
done

echo ""
echo "🎉 Git hooks setup completed!"
echo ""
echo "📝 Installed hooks:"
for hook in "${hooks[@]}"; do
    if [ -f ".git/hooks/$hook" ]; then
        echo "   ✓ $hook"
    fi
done

echo ""
echo "ℹ️  These hooks will now run automatically on:"
echo "   • pre-commit: Before each commit"
echo "   • commit-msg: To validate commit messages"
echo "   • pre-push: Before pushing to remote repository"