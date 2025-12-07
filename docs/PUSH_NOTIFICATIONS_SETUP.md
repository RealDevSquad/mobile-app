# Push Notifications Setup Guide

This guide explains how to set up push notifications for the Real Dev Squad mobile app using Expo and Firebase Cloud Messaging (FCM).

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [pnpm](https://pnpm.io/) package manager
- [Expo account](https://expo.dev/) (free)
- [Firebase account](https://console.firebase.google.com/) (free)
- EAS CLI installed: `npm install -g eas-cli`

## Overview

Push notifications in this app use:

- **Expo Push Notifications** - Handles token management and notification delivery
- **Firebase Cloud Messaging (FCM)** - Required for Android devices
- **FCM V1 API** - The recommended authentication method

## Step 1: Firebase Project Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter a project name and follow the setup wizard

### 1.2 Add Android App to Firebase

1. In your Firebase project, click **Add app** → Select **Android**
2. Enter the Android package name: `com.anonymous.mobileapp2.x0`
3. (Optional) Add app nickname and SHA-1 certificate
4. Click **Register app**

### 1.3 Download google-services.json

1. After registering, download the `google-services.json` file
2. Place it in the project root directory (same level as `app.json`)

```
mobile-app/
├── app.json
├── google-services.json  ← Place here
├── package.json
└── ...
```

### 1.4 Get Firebase Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file and save it as `firebase-service-account.json` in the project root

> ⚠️ **Security Note**: Both `google-services.json` and `firebase-service-account.json` contain sensitive credentials. They are already added to `.gitignore` and should NEVER be committed to version control.

## Step 2: Configure app.json

Ensure your `app.json` has the following Android configuration:

```json
{
  "expo": {
    "android": {
      "package": "com.anonymous.mobileapp2.x0",
      "googleServicesFile": "./google-services.json"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

## Step 3: Upload FCM Credentials to Expo

Expo needs your Firebase credentials to send push notifications on your behalf.

### 3.1 Login to EAS

```bash
eas login
```

### 3.2 Configure FCM V1 Credentials

```bash
eas credentials
```

Follow the interactive prompts:

1. Select **Android**
2. Select **production**
3. Choose **Google Service Account**
4. Select **Upload a Google Service Account Key**
5. Upload your `firebase-service-account.json` file
6. Then select **Manage your Google Service Account Key for Push Notifications (FCM V1)**
7. Select **Select an existing Google Service Account Key for Push Notifications (FCM V1)**
8. Choose the key you just uploaded

### 3.3 Verify Configuration

After setup, you should see:

```
Push Notifications (FCM V1): Google Service Account Key For FCM V1
Project ID      your-firebase-project-id
Client Email    firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## Step 4: Build the App

### Local Development Build

```bash
# Clean and regenerate native folders
npx expo prebuild --clean

# Run on Android
npx expo run:android
```

### Production APK

```bash
npx expo prebuild --clean
cd android && ./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Using EAS Build (Cloud)

```bash
eas build --platform android
```

## Step 5: Backend Integration

The app sends the Expo Push Token to your backend. Your backend then uses Expo's Push API to send notifications.

### Token Flow

1. App requests notification permissions
2. App obtains Expo Push Token
3. App sends token to backend API
4. Backend stores token associated with user
5. Backend sends notifications via Expo Push API

### Sending Notifications from Backend

Use Expo's Push API:

```python
import requests

def send_push_notification(expo_token, title, body):
    response = requests.post(
        "https://exp.host/--/api/v2/push/send",
        json={
            "to": expo_token,
            "title": title,
            "body": body,
        },
        headers={
            "Content-Type": "application/json",
        }
    )
    return response.json()
```

## Troubleshooting

### Error: "FirebaseApp is not initialized"

**Cause**: Missing or incorrect `google-services.json`

**Solution**:

1. Verify `google-services.json` exists in project root
2. Verify `googleServicesFile` is set in `app.json`
3. Run `npx expo prebuild --clean` and rebuild

### Error: "Unable to retrieve the FCM server key"

**Cause**: FCM credentials not uploaded to Expo

**Solution**:

1. Run `eas credentials`
2. Upload your Firebase Service Account Key
3. Configure it for Push Notifications (FCM V1)

### Error: "eas.json could not be found"

**Cause**: Missing EAS configuration

**Solution**: Create `eas.json` in project root:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Notifications work in Expo Go but not in APK

**Cause**: Expo Go uses shared Firebase config, production builds need your own

**Solution**: Follow all steps above to configure your own Firebase project

## Files Reference

| File                            | Purpose                            | Git Ignored |
| ------------------------------- | ---------------------------------- | ----------- |
| `google-services.json`          | Firebase client config for Android | ✅ Yes      |
| `firebase-service-account.json` | Firebase Admin SDK / FCM V1 auth   | ✅ Yes      |
| `eas.json`                      | EAS Build configuration            | ❌ No       |
| `app.json`                      | Expo app configuration             | ❌ No       |

## Useful Links

- [Expo Push Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [FCM Credentials Setup](https://docs.expo.dev/push-notifications/fcm-credentials/)
- [Firebase Console](https://console.firebase.google.com/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
