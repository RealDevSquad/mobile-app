## Real Dev Squad Expo Mobile App

Welcome to the Real Dev Squad Expo app project!
## Tech Stack

   * React Native (Expo)
   * TypeScript
   * StyleSheet

## About the Project

This repository contains the cross-platform mobile app for Real Dev Squad, built using React Native with Expo.

## First Phase of migration to Expo

- Project Setup for Expo
- AuthScreen
  - GitHub authentication
  - Web authentication
- HomeScreen
  - user status (active or OOO)
  - a form to change the status
- NotifyScreen
  - Notification-related features
- ProfileScreen
  - Developer Profile
  - Active and all tasks
  - Logout feature

## Second Phase of migration to Expo
- Developer mode
- Goals site Tab
- A TODO app to assign tasks to members of Real Dev Squad

## Prerequisites

To contribute, make sure you have the following:

- JDK ( openjdk  17.0.13 2025-03-15 )
- Node setup ( use version v18.*, tested on v18.18.0)
- React Native development environment set up
- Android Studio installed
- Xcode installed
- Cocopods for IOS installed
- Node.js installed
- for Node version management: [Volta](https://docs.volta.sh/guide/getting-started) | [Why Volta?](https://docs.volta.sh/guide/#why-volta)
- Expo installed locally (Global installation is deprecated)

# **NOTE** : Make sure to set up the proper development environment required to run Hello world app in RN Expo and drop a video link in #react-native channel.

For detailed setup instructions,  refer to [React Native environment setup guide](https://reactnative.dev/docs/environment-setup).


### Local App setup for Expo

- Set up your local environment for React Native Expo following the environment setup guide.
- Clone the mobile app repository from develop branch:
- git clone https://github.com/Real-Dev-Squad/mobile-app.git
- Switch to the dev-expo branch
- Change the directory to RDSExpoApp
- Run the command: `yarn`
- Start contributing!

## Contribution Guide

To contribute to our project:

- Browse the issues and comment on the one you'd like to work on.
- Once an issue is assigned to you, follow the local app setup steps.
- Before pushing code, ensure it runs without errors.
- Run yarn run `precommit-check`.
- Commit your changes with a descriptive message.
- Push your code to your branch.
- If you need assistance, reach out on the mobile-app-react-native channel on Discord.




## Git commands for local Expo setup
```
git clone https://github.com/Real-Dev-Squad/mobile-app.git

cd RDSExpoApp

yarn


```


## Git commands to commit your code:
```
git checkout -b 'your-PR-name'

git add <files>

git commit -m "Your commit message"

git push origin your-PR-name

```


## Test-Driven Development (TDD)

All PRs should have 100% test coverage. Before submitting PRs, run yarn test to ensure all tests pass.

**Running/Development for Expo**

- Start Metro bundler: `npx expo start`
- For Android: `npx expo run:android`
- For iOS: yarn `npx expo run:ios`

If the above commands fail, try building the Android app from Android Studio and the iOS app from Xcode.
