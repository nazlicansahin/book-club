# Quest Log — Mobile (Capacitor)

Native iOS and Android shells that load the live Quest Log web app from Vercel.

## Prerequisites

- **macOS + Xcode** (for iOS / TestFlight)
- **Android Studio** (for Android)
- **Apple Developer Program** ($99/year) for TestFlight & App Store
- **Google Play Console** ($25 one-time) for Android

## Setup

```bash
cd mobile
npm install
npx cap add ios      # first time only
npx cap add android  # first time only
npx cap sync
```

## Run locally

Point the shell at your dev server (optional):

```bash
CAPACITOR_SERVER_URL=http://YOUR_LAN_IP:3000 npx cap sync
npx cap open ios     # or: npm run ios
```

Default production URL: `https://book-club-wheat-seven.vercel.app`

## TestFlight (iOS)

1. Open `mobile/ios/App/App.xcworkspace` in Xcode
2. Select your Team under **Signing & Capabilities**
3. Set bundle ID: `com.questlog.bookclub`
4. **Product → Archive**
5. **Distribute App → App Store Connect**
6. In [App Store Connect](https://appstoreconnect.apple.com) → **TestFlight** → add testers

Most UI changes deploy via Vercel — no new TestFlight build needed unless you change native config, icons, or plugins.

## Firebase / Google Sign-In

Register iOS and Android apps in Firebase project `quest-log-bc`:

1. Add iOS app → download `GoogleService-Info.plist` → place in `mobile/ios/App/App/`
2. Add Android app → download `google-services.json` → place in `mobile/android/app/`
3. In Google Cloud Console, create OAuth clients for iOS (bundle ID) and Android (SHA-1)
4. Add authorized domains in Firebase Auth: your Vercel URL + `localhost`

If Google sign-in fails inside the WebView, switch to `@capacitor-firebase/authentication` (see plan).

## Android release

```bash
cd mobile
npx cap open android
```

In Android Studio: **Build → Generate Signed Bundle / APK** → upload to Play Console **Internal testing**.

## Privacy policy

Required for store listings: https://book-club-wheat-seven.vercel.app/privacy

## Icons & splash

Replace assets via [Capacitor Assets](https://github.com/ionic-team/capacitor-assets):

```bash
npm install -g @capacitor/assets
# Add mobile/resources/icon.png (1024x1024) and splash.png
npx capacitor-assets generate --ios --android
```
