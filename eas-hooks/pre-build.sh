#!/bin/bash
# EAS build hook to disable APK splits and ensure single-architecture build
# This runs before the native build step

set -euo pipefail

BUILD_GRADLE="android/app/build.gradle"

if [ ! -f "$BUILD_GRADLE" ]; then
    echo "⚠️  build.gradle not found at $BUILD_GRADLE, skipping modification"
    exit 0
fi

echo "🔧 Modifying build.gradle to disable APK splits..."

# Create backup
cp "$BUILD_GRADLE" "${BUILD_GRADLE}.bak"

# Use Python for more reliable text manipulation
python3 << 'PYTHON_SCRIPT'
import re
import sys

file_path = "android/app/build.gradle"
with open(file_path, 'r') as f:
    content = f.read()

# Check if android block exists
if 'android {' not in content:
    print("⚠️  No android block found in build.gradle")
    sys.exit(0)

# Pattern to find splits block
splits_pattern = r'splits\s*\{[^}]*\}'

# Check if splits block exists
if re.search(splits_pattern, content, re.DOTALL):
    # Replace existing splits block to disable ABI splits
    new_splits = '''splits {
        abi {
            enable false
        }
    }'''
    content = re.sub(splits_pattern, new_splits, content, flags=re.DOTALL)
    print("✅ Modified existing splits block")
else:
    # Add splits block after android {
    android_match = re.search(r'(android\s*\{)', content)
    if android_match:
        insert_pos = android_match.end()
        new_splits = '''
    splits {
        abi {
            enable false
        }
    }'''
        content = content[:insert_pos] + new_splits + content[insert_pos:]
        print("✅ Added splits block to disable ABI splits")

# Write back
with open(file_path, 'w') as f:
    f.write(content)

print(f"✅ Successfully modified {file_path}")
PYTHON_SCRIPT

if [ $? -eq 0 ]; then
    echo "✅ build.gradle modification completed successfully"
else
    echo "⚠️  Python script failed, restoring backup..."
    mv "${BUILD_GRADLE}.bak" "$BUILD_GRADLE"
    exit 1
fi

