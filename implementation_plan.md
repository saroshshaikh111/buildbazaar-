# Phase 9: Google Play Store Preparation & EAS Android Build Plan

## Overview
To make **BuildBazaar Mobile** available on the Google Play Store and shareable as a downloadable Android app (`.apk` / `.aab`), we will configure Expo Application Services (EAS Build), package the app metadata, and trigger cloud builds.

---

## User Review Required

> [!IMPORTANT]
> - **EAS Cloud Build**: Requires an Expo account (`expo.dev`). If you are logged in to EAS CLI, the build will compile directly in the Expo cloud and produce a download link.
> - **Google Play Console**: Uploading the `.aab` (Android App Bundle) to the Google Play Store requires a Google Play Developer account ($25 one-time fee from Google).

---

## Proposed Changes & Workflow

### 1. App Configuration (`mobile/app.json`)
- Verify app name: `BuildBazaar`.
- Package identifier: `com.buildbazaar.app`.
- Version code: `1` (Version `1.0.0`).
- Ensure adaptive icons, splash screen, and permissions are correctly declared.

### 2. EAS Build Configuration (`mobile/eas.json`)
- **Preview Profile (`.apk`)**: Generates a downloadable `.apk` file for direct installation on any Android phone (for immediate testing & sharing).
- **Production Profile (`.aab`)**: Generates an Android App Bundle (`.aab`) formatted specifically for uploading to Google Play Console.

### 3. Build Triggers
- Execute `npx eas-cli build -p android --profile preview` to trigger the cloud APK build.
- Execute `npx eas-cli build -p android --profile production` to trigger the Play Store AAB build.

---

## Verification Plan

### Automated / Cloud Verification
- Confirm build job completion in EAS Cloud (`https://expo.dev/accounts/saroshshaikh111/projects/mobile/builds`).
- Download and verify the generated `.apk` file.

### Manual Verification
- Install `.apk` on an Android device to confirm native UI, Supabase authentication, and catalog features function properly.
