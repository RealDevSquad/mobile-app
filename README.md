## Real Dev Squad Expo Mobile App

Welcome to the Real Dev Squad Expo app project. This repository contains the cross-platform mobile app for Real Dev Squad, built using React Native with Expo.

## Tech Stack

   * React Native (Expo)
   * TypeScript
   * StyleSheet

## Required tools

- JDK ( openjdk  17.0.13 2025-03-15 )
- React Native development environment set up (EXPO)
- Android Studio installed (for Android)
- Xcode installed (for IOS)
- Cocopods installed (for IOS)
- Nodejs setup ( use version v18.*, tested on v18.18.0)
- for Node version management: [Volta](https://docs.volta.sh/guide/getting-started) | [Why Volta?](https://docs.volta.sh/guide/#why-volta)
- Expo installed locally (Global installation is deprecated)

## Environment Setup

Follow the official guide: [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment)

<details>
<summary><strong>Android Setup (Tap to Expand)</strong></summary>

<br>

- Install [**Node.js**](https://nodejs.org/en/download/)

- Download and Install [**Android Studio**](https://developer.android.com/studio)

- Ensure [**Android SDK**](https://developer.android.com/studio#downloads), [Android SDK Platform](https://developer.android.com/studio) and [**Android Virtual Device (AVD)**](https://developer.android.com/studio/run/managing-avds) are set up

## Setting up an Android Emulator
- Open Android Studio and navigate to AVD Manager
![Screenshot 2025-05-01 182731](https://github.com/user-attachments/assets/0366cbcf-2dc1-4ffe-b161-121dc86a659e)

- Click on create Virtual Device
![Screenshot 2025-05-01 182731](https://github.com/user-attachments/assets/5534f287-1a2e-47ef-b62a-050df850c4d6)

- Select a hardware profile of your choice(eg. Pixel 8 Pro) and click Next.

![Screenshot 2025-05-01 183138](https://github.com/user-attachments/assets/7c559182-a401-4211-81a2-ad3f420eef05)


- Choose a system Image (eg. API 36)

- Double click on it to install it.
![Screenshot 2025-05-01 183551](https://github.com/user-attachments/assets/c26333ef-0dca-4754-a126-97e581e0da60)

- After installation click Finish.

- Select the installed System image and click Next
![Screenshot 2025-05-01 183903](https://github.com/user-attachments/assets/e5bbd27a-9418-4876-b316-bb20521ba67a)


- Review Android Virtual Device's configuration and click Finish (recommended to keep the default config)

![Screenshot 2025-05-01 183955](https://github.com/user-attachments/assets/f2ec72b8-4d52-48fa-9f41-60dc92f0946e)

- After this your device should be visible in the Device Manager list (eg. Pixel 8 Pro API 36)

![Screenshot 2025-05-01 184414](https://github.com/user-attachments/assets/df099b96-cd2d-4b69-bbe9-0c37ca19dcff)


- You can select your virtual device at the top from the dropdown menu and click run to verify if your emulator is installed successfully or not.

![Screenshot 2025-05-01 185428](https://github.com/user-attachments/assets/ef594e3f-83f9-4ea9-ada3-a96963699dc1)

- You need to add these export statements to your shell configuration file so that VS Code (and your terminal) can recognize Android SDK paths globally.

- In VScode open a new terminal
- Open your .zshrc or .bash_profile in vs code
```
    code ~/.zshrc
```
OR USE ~/.bash_profile if using bash
```
    ~/.bash_profile
```

- Add the following lines at the end
```
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH
```
- save the file
- reload the terminal or run
```
    source ~/.zshrc
```
- Set ANDROID_HOME and update your PATH correctly so it works in VS Code and any terminal (for windows environment)
- Find your Android SDK path
Usually it's
```
    C:\Users\<YourUsername>\AppData\Local\Android\Sdk
```
2. Set ANDROID_HOME and update PATH in environment variable
settings → search for “Environment Variables” → open “Edit the system environment variables” → click “Environment Variables…"

- Add a new User Variable
Variable name: ANDROID_HOME

Variable value:
```
    C:\Users\<YourUsername>\AppData\Local\Android\Sdk
```

- Update the Path variable
In the User variables, select Path → click Edit → then Add these paths:

```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator

```

- Apply changes, click ok and close all dialogs.

- To verify in VS code or in any terminal, open a new terminal in VS Code and run
```
adb --version
emulator -list-avds
```
If those run without errors, your setup is correct.

![Screenshot 2025-05-01 191907](https://github.com/user-attachments/assets/928b95fc-8890-4402-82b3-66fd35dbd331)

- Install [**JDK (OpenJDK 17)**](https://www.oracle.com/java/technologies/javase/jdk17-0-13-later-archive-downloads.html)

- Setup enviornment variables for JDK

- Use [**Node.js v18.\***](https://nodejs.org/en/download/releases/) (Tested on [v18.18.0](https://nodejs.org/dist/v18.18.0/))

- Use [**Volta**](https://docs.volta.sh/guide/getting-started) for managing Node versions ([Why Volta?](https://docs.volta.sh/guide/#why-volta))

- Install [**Expo CLI**](https://docs.expo.dev/more/expo-cli/) locally (Note: Global CLI is deprecated)
```
    npm install expo-cli --save-dev
```


</details>

<details>
<summary><strong>iOS Setup (Tap to Expand)</strong></summary>

<br>

- Install [**Homebrew**](https://brew.sh)
- Install [**Node.js v18.18.0**](https://nodejs.org/en/download/) and [**Watchman**](https://facebook.github.io/watchman/docs/install)

```
    brew install node
    brew install watchman
```

- Install [**Xcode**](https://apps.apple.com/us/app/xcode/id497799835) and simulator for iOS

- Install Xcode Command Line Tools (included with [**Xcode 16.2**](https://developer.apple.com/xcode/resources/))

<img width="829" alt="xcode" src="https://github.com/user-attachments/assets/6fb24e91-8c85-4726-9b83-d1e3cda381bd" />

- Install [**CocoaPods**](https://guides.cocoapods.org/using/getting-started.html)

```
    sudo gem install cocoapods
```

- You need to add these export statements to your shell configuration file so that VS Code (and your terminal) can recognize the SDK paths globally.
Add the following in your ~/.zshrc

```
    export PATH=~/.npm-global/bin:$PATH

```

- Apply the changes

```
    source ~/.zshrc
```

- Install [**Volta (Version Manager for JS tooling)**](https://docs.volta.sh/guide/getting-started)
```
    volta install node@18

```

- Install [**Expo CLI**](https://docs.expo.dev/more/expo-cli/) locally (Note: Global CLI is deprecated)
```
    npm install expo-cli --save-dev
```

</details>

### Local App setup for Expo

- Set up your local environment for React Native Expo following the environment setup guide given above.

- Clone the mobile app repository from develop branch
```
    git clone https://github.com/Real-Dev-Squad/mobile-app.git
```
- Switch to the dev-expo branch
(Note: Here make sure only RDSExpoApp folder and readme.md file should be present, if any other files/folders exists those might be from CLI app which can cause dependency colflicts in the code, make sure to delete them before running the app)
```
git checkout dev-expo
```

- Change the directory to RDSExpoApp
```
cd RDSExpoApp
```

- Run the command
```
yarn install
```
- To run the app in Android Emulator
```
npx expo run:android
```
![Screenshot 2025-04-30 152118](https://github.com/user-attachments/assets/8d9fa438-039d-4e07-96dd-ab32ef688a01)


- To run the app in IOS Simulator
```
npx expo run:ios
```
<img width="1470" alt="xcodeemulator" src="https://github.com/user-attachments/assets/360fd733-3e2e-40c7-bddc-01a9862c5520" />

- Start contributing!


**NOTE**: Make sure to set up the proper development environment required to run a Hello World app in RN Expo and drop a video link in #react-native channel.



## Contribution Guide

To contribute to our project:

- Browse the issues and comment on the one you'd like to work on.
- Once an issue is assigned to you, follow the local app setup steps.
- Before pushing code, ensure it runs without errors.
- Run yarn run `precommit-check`.
- Commit your changes with a descriptive message.
- Push your code to your branch.
- If you need assistance, reach out on the mobile-app-react-native channel on Discord.


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

- Start Metro bundler
```
 npx expo start
``` 
- For Android
```
 npx expo run:android
``` 
- For iOS yarn 
```
npx expo run:ios
```
If the above commands fail, try building the Android app from Android Studio and the iOS app from Xcode.
