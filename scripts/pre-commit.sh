#! /bin/sh

if git diff --cached --name-only | grep -q '^ai-ticket-assistant-ui/'; then
  echo "🔍 UI changes detected, running build before commit"
  cd ai-ticket-assistant-ui
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Build failed, aborting commit."
    exit 1
  fi
else
  echo "✅ No UI changes detected, skipping build."
fi