# Contributing to RDS Mobile App

Welcome! This guide will help you set up the RDS Mobile App project from scratch, even if you're completely new to mobile development. We'll walk you through every step, from installing the necessary tools to running the app on your device or simulator.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
3. [Setting Up Environment Variables](#setting-up-environment-variables)
4. [Running the Application](#running-the-application)
5. [Testing Your Setup](#testing-your-setup)
6. [Making Your First Contribution](#making-your-first-contribution)
7. [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, you'll need a few things:

- A computer (Windows, macOS, or Linux)
- An internet connection
- A GitHub account (if you want to contribute)
- Basic familiarity with using a terminal/command line (don't worry, we'll guide you!)

## Step-by-Step Setup Guide

### Step 1: Install Git

Git is a version control system that lets us track changes in our code.

**Windows:**

- Download Git from [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Run the installer and follow the default options
- Verify installation: Open Git Bash and run `git --version`

**macOS:**

- Git usually comes pre-installed. Check with: `git --version`
- If not installed, install via [Homebrew](https://brew.sh/): `brew install git`

**Linux (Ubuntu/Debian):**

- Run: `sudo apt update && sudo apt install git`
- Verify: `git --version`

📖 **Learn more:** [Git Documentation](https://git-scm.com/doc)

### Step 2: Install Node.js (via Volta)

We use **Volta** to manage Node.js versions automatically. This ensures everyone uses the same version.

**Windows:**

- Download Volta from [https://volta.sh/](https://volta.sh/)
- Run the installer from [https://github.com/volta-cli/volta/releases](https://github.com/volta-cli/volta/releases)

**macOS:**

- Install via Homebrew: `brew install volta`
- Or download from [https://volta.sh/](https://volta.sh/)

**Linux:**

- Run the installation script:
  ```bash
  curl https://get.volta.sh | bash
  ```
- Restart your terminal after installation

Verify installation:

```bash
volta --version
```

📖 **Learn more:** [Volta Documentation](https://docs.volta.sh/)

### Step 3: Install pnpm (Package Manager)

This project uses `pnpm` instead of npm for faster and more efficient package management.

Install pnpm globally:

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm --version
```

📖 **Learn more:** [pnpm Documentation](https://pnpm.io/)

### Step 4: Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/Real-Dev-Squad/mobile-app.git
cd mobile-app
```

### Step 5: Install Dependencies

Once inside the project directory, install all required packages:

```bash
pnpm install
```

This might take a few minutes on first run. You'll see packages being downloaded and installed.

### Step 6: Install Expo CLI (if needed)

Expo CLI is usually installed automatically, but you can verify:

```bash
npx expo --version
```

If it's not available, install it globally:

```bash
npm install -g expo-cli
```

📖 **Learn more:** [Expo Documentation](https://docs.expo.dev/)

### Step 7: Set Up Environment Variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Open the `.env` file in your text editor and add the following:

```env
EXPO_PUBLIC_API_URL=https://api.realdevsquad.com
EXPO_PUBLIC_API_KEY=your_api_key_here
APP_ENV=development
```

**Note:** You'll need to get the actual API key from the project maintainers or check the project documentation for the correct values.

### Step 8: Choose Your Development Platform

You have three options for running the app:

#### Option A: Web Browser (Easiest - Good for beginners!)

The web version is the easiest way to get started and doesn't require additional setup:

```bash
pnpm web
```

The app will open in your default web browser.

#### Option B: Android Development

**For Android, you need:**

1. **Android Studio:**
   - Download from [https://developer.android.com/studio](https://developer.android.com/studio)
   - Install Android Studio following the [official setup guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android)
   - Set up an Android Virtual Device (AVD) - Android Studio will guide you through this

2. **Java Development Kit (JDK):**
   - Android Studio usually installs this automatically
   - Or download from [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)

3. **Set up environment variables** (if on Windows/Linux):
   ```bash
   # Add to your ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

📖 **Complete Android Setup Guide:** [Expo Android Setup](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android)

#### Option C: iOS Development (macOS only)

**For iOS, you need:**

1. **Xcode:**
   - Download from the Mac App Store (it's large, ~15GB, so be patient!)
   - Or download from [Apple Developer](https://developer.apple.com/xcode/)
   - Install Xcode Command Line Tools: `xcode-select --install`

2. **CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

📖 **Complete iOS Setup Guide:** [Expo iOS Setup](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios)

**Note:** You can skip Android/iOS setup initially and use the web version to get started!

## Setting Up Environment Variables

Create a `.env` file in the root directory:

```bash
# In the project root directory
touch .env
```

Add these required variables to your `.env` file:

```env
# Required: Backend API URL
EXPO_PUBLIC_API_URL=https://api.realdevsquad.com

# Optional: API Key (ask maintainers for the actual key)
EXPO_PUBLIC_API_KEY=your_api_key_here

# Environment (development, staging, or production)
APP_ENV=development
```

**Important:**

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Ask project maintainers for the correct API URL and key values
- The `.env` file should stay in the project root directory

## Running the Application

### Quick Start (Web - Recommended for Beginners)

```bash
pnpm web
```

This opens the app in your browser - no mobile setup needed!

### Start Development Server

```bash
pnpm start
```

This will:

- Start the Expo development server
- Show a QR code in your terminal
- Give you options to:
  - Press `w` to open in web browser
  - Press `a` to open Android emulator (if set up)
  - Press `i` to open iOS simulator (if set up, macOS only)
  - Scan QR code with Expo Go app on your phone

### Run on Android

```bash
pnpm android
```

**First time:** Make sure you have an Android emulator running or a device connected via USB with USB debugging enabled.

### Run on iOS (macOS only)

```bash
pnpm ios
```

**First time:** This will build the iOS app, which may take a few minutes.

## Testing Your Setup

1. **Verify Node.js is working:**

   ```bash
   node --version
   ```

2. **Verify pnpm is installed:**

   ```bash
   pnpm --version
   ```

3. **Check if dependencies are installed:**

   ```bash
   pnpm list
   ```

4. **Run the linter:**

   ```bash
   pnpm lint
   ```

5. **Run tests:**

   ```bash
   pnpm test
   ```

6. **Try running the app:**
   ```bash
   pnpm start
   ```

If all these work without errors, you're all set! 🎉

## Making Your First Contribution

### 1. Fork and Clone the Repository

1. Go to the project on GitHub: [Real-Dev-Squad/mobile-app](https://github.com/Real-Dev-Squad/mobile-app)
2. Click the "Fork" button (top right)
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mobile-app.git
   cd mobile-app
   ```

### 2. Create a Branch

Always create a new branch for your changes:

```bash
git checkout -b your-feature-name
```

Good branch names: `fix-login-button`, `add-profile-screen`, `update-readme`

### 3. Make Your Changes

- Edit files in your code editor (VS Code, WebStorm, etc.)
- Make small, focused changes
- Test your changes by running `pnpm start` or `pnpm web`

### 4. Run Code Quality Checks

Before committing, make sure your code follows the project standards:

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format your code
pnpm format

# Run tests
pnpm test
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "Add: your descriptive commit message"
```

**Good commit messages:**

- `Add: user profile screen`
- `Fix: login button alignment`
- `Update: README documentation`

**Bad commit messages:**

- `changes`
- `fix`
- `update`

### 6. Push and Create a Pull Request

```bash
git push origin your-feature-name
```

Then:

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit!

## Additional Resources

### Official Documentation

- **Expo Documentation:** [https://docs.expo.dev/](https://docs.expo.dev/)
- **React Native Documentation:** [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
- **TypeScript Handbook:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **React Documentation:** [https://react.dev/](https://react.dev/)

### Setup Guides

- **Expo Setup (All Platforms):** [https://docs.expo.dev/get-started/installation/](https://docs.expo.dev/get-started/installation/)
- **Android Setup:** [https://docs.expo.dev/get-started/set-up-your-environment/?platform=android](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android)
- **iOS Setup:** [https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios)
- **Expo Go App:** [https://expo.dev/client](https://expo.dev/client) (Download for iOS/Android to test on real device)

### Learning Resources

- **Expo Router (File-based Routing):** [https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)
- **React Native Basics:** [https://reactnative.dev/docs/tutorial](https://reactnative.dev/docs/tutorial)
- **JavaScript (if you're new):** [https://javascript.info/](https://javascript.info/)
- **Git Basics:** [https://git-scm.com/docs](https://git-scm.com/docs)

### Project-Specific

- **Project README:** See [README.md](./README.md) for project structure and coding conventions
- **Real Dev Squad:** [https://www.realdevsquad.com/](https://www.realdevsquad.com/)

### Getting Help

- **Expo Discord:** [https://chat.expo.dev/](https://chat.expo.dev/)
- **React Native Community:** [https://reactnative.dev/community/overview](https://reactnative.dev/community/overview)
- **GitHub Issues:** Check existing issues or create a new one in the repository
- **Ask maintainers:** Don't hesitate to ask questions!

## Need More Help?

If you're stuck:

1. Check the project's README.md file
2. Search existing GitHub issues
3. Ask in project discussions or chat channels
4. Create a new issue with details about your problem

Remember: Everyone was a beginner once! Don't hesitate to ask questions and contribute. Every contribution, no matter how small, is valuable. 🚀

Happy coding! 🎉
