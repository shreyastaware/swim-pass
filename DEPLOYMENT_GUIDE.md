# 🚀 Deploy Swim Pass App to Google Play Store

## Complete Step-by-Step Guide

This guide will help you deploy your Swim Pass visitor management app to the Google Play Store using Expo EAS Build.

---

## ✅ Prerequisites

Before you start, make sure you have:

1. **Google Play Developer Account**
   - Cost: $25 one-time registration fee
   - Sign up at: https://play.google.com/console/signup

2. **App Working on Android**
   - Test the app thoroughly on Android device or emulator
   - Verify all features work (visitor form, camera, Google Sheets/Drive)

3. **Environment Variables Configured**
   - `.env` file with all Google credentials
   - See `SETUP_GUIDE.md` for details

---

## Step 1: Install EAS CLI

Install the Expo Application Services CLI globally:

```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

---

## Step 2: Login to Expo Account

Create an Expo account (if you don't have one) and login:

```bash
eas login
```

Or create a new account:
```bash
eas register
```

---

## Step 3: Configure Your Project

Initialize EAS in your project:

```bash
eas build:configure
```

This will:
- Create/update `eas.json` configuration file
- Link your project to your Expo account

---

## Step 4: Update App Information (Optional)

The app is already configured with:
- **App Name**: Swim Pass
- **Package Name**: `com.swimpass.app`
- **Version**: 1.0.0
- **Version Code**: 1

If you want to customize these, edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1
    }
  }
}
```

**Important**: The package name should be unique and follow reverse domain notation.

---

## Step 5: Set Environment Variables for Build

EAS Build needs your environment variables. Create a `.env.production` file:

```bash
cp .env .env.production
```

Or set environment secrets in EAS:

```bash
# Set each variable individually
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY --value "your_api_key"
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_SPREADSHEET_ID --value "your_spreadsheet_id"
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY --value '{"type":"service_account",...}'
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_DRIVE_FOLDER_ID --value "your_folder_id"
```

**Recommended**: Use EAS secrets for production to keep credentials secure.

---

## Step 6: Build for Android (APK for Testing)

Build an APK for testing first:

```bash
eas build --platform android --profile preview
```

This will:
- Upload your project to EAS Build servers
- Build an APK (not AAB)
- Provide a download link when complete (takes 10-20 minutes)

**Download and test the APK** on your Android device before proceeding.

---

## Step 7: Build for Production (AAB for Play Store)

Once testing is complete, build the production Android App Bundle:

```bash
eas build --platform android --profile production
```

This creates an **AAB (Android App Bundle)** which is required by Google Play Store.

The build process:
1. Uploads your code to EAS servers
2. Compiles native Android app
3. Creates signed AAB file
4. Provides download link (takes 15-30 minutes)

---

## Step 8: Generate Upload Keystore

If this is your first build, EAS will ask:

```
? Would you like to automatically create a new Android Keystore? (Y/n)
```

**Choose YES** - EAS will generate and securely store your keystore.

**IMPORTANT**: This keystore is used to sign all future updates. Keep it safe!

---

## Step 9: Download Your AAB

Once the build completes:

1. You'll receive a URL to download the AAB file
2. Or view all builds at: https://expo.dev/accounts/[your-account]/projects/swim-pass/builds

Download the `.aab` file to your computer.

---

## Step 10: Upload to Google Play Console

### A. Create App in Play Console

1. Go to: https://play.google.com/console
2. Click **"Create app"**
3. Fill in details:
   - **App name**: Swim Pass
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept declarations and click **"Create app"**

### B. Complete Store Listing

Under **"Store presence"** → **"Main store listing"**:

1. **App details**:
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)

2. **Screenshots** (At least 2 required):
   - Phone screenshots (16:9 or 9:16 ratio)
   - Take screenshots from the app

3. **Categorization**:
   - App category: Business / Productivity
   - Tags: visitor management, entry system, etc.

4. **Contact details**:
   - Email address
   - Phone number (optional)
   - Website (optional)

5. Click **"Save"**

### C. Set Up Content Rating

1. Go to **"Policy"** → **"App content"**
2. Click **"Start questionnaire"**
3. Answer questions about your app content
4. Generate rating
5. Click **"Save"**

### D. Select Target Audience

1. Go to **"Policy"** → **"Target audience and content"**
2. Select target age group (typically 18+)
3. Complete questionnaire
4. Click **"Save"**

### E. Create Production Release

1. Go to **"Release"** → **"Production"**
2. Click **"Create new release"**
3. Upload your AAB file (drag and drop or select)
4. Add release notes:
   ```
   Initial release:
   - Visitor entry form with photo capture
   - Admin dashboard to view entries
   - Integration with Google Sheets and Drive
   ```
5. Review release
6. Click **"Save"** and then **"Review release"**

### F. Submit for Review

1. Review all sections (they should have green checkmarks)
2. Click **"Start rollout to production"**
3. Confirm submission

---

## Step 11: Wait for Review

Google Play will review your app:
- **Typical review time**: 1-3 days
- **Notification**: You'll receive email updates
- **Status**: Check at https://play.google.com/console

Once approved, your app will be live on the Play Store! 🎉

---

## 🔄 Updating Your App

When you want to release an update:

### 1. Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

**Important**:
- Increment `versionCode` by 1 for each release (2, 3, 4...)
- Update `version` (1.0.1, 1.0.2, 1.1.0, etc.)

### 2. Build new version:
```bash
eas build --platform android --profile production
```

### 3. Upload to Play Console:
- Go to Production → Create new release
- Upload new AAB
- Add release notes
- Submit for review

---

## 📦 Build Profiles Explained

Your `eas.json` has three profiles:

### **development**
```bash
eas build --platform android --profile development
```
- For internal testing with Expo Go
- Includes development tools
- Not for Play Store

### **preview**
```bash
eas build --platform android --profile preview
```
- Creates APK for testing
- Install on device without Play Store
- Test before production build

### **production**
```bash
eas build --platform android --profile production
```
- Creates AAB for Play Store
- Optimized and minified
- Auto-increments version code

---

## 🐛 Troubleshooting

### Build fails with "Environment variable not found"
**Solution**: Add environment variables to EAS secrets:
```bash
eas secret:create --scope project --name VARIABLE_NAME --value "value"
```

### "Package name already exists"
**Solution**: Change package name in `app.json`:
```json
"android": {
  "package": "com.yourcompany.uniquename"
}
```

### Build succeeds but app crashes on launch
**Solution**:
1. Check logs: `eas build:view`
2. Test with `--profile preview` first
3. Ensure all native modules are compatible with React Native 0.79

### Google Play rejects app
**Common reasons**:
- Missing privacy policy (required if you collect data)
- Incomplete store listing
- Content rating issues
- Target SDK version too old

---

## 📝 Important Notes

### Security
- ✅ `.env` file is in `.gitignore` (credentials are protected)
- ✅ Use EAS secrets for production builds
- ✅ Never commit API keys or service account JSON to Git

### Testing
- ✅ Always test with `--profile preview` before production
- ✅ Test on multiple Android devices/versions
- ✅ Verify Google Sheets/Drive integration works
- ✅ Test camera permissions

### Play Store Requirements
- ✅ Target SDK 34 or higher (Android 14)
- ✅ Privacy policy URL (if collecting user data)
- ✅ App must not crash on launch
- ✅ All permissions must be justified

---

## 🎯 Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Build for testing (APK)
eas build --platform android --profile preview

# Build for production (AAB)
eas build --platform android --profile production

# View all builds
eas build:list

# View build details
eas build:view [BUILD_ID]

# Manage secrets
eas secret:list
eas secret:create --scope project --name NAME --value "value"
eas secret:delete --scope project --name NAME

# Submit to Play Store (automated - coming soon)
eas submit --platform android
```

---

## 🔗 Helpful Resources

- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **Google Play Console**: https://play.google.com/console
- **Expo Dashboard**: https://expo.dev
- **App Signing Guide**: https://docs.expo.dev/app-signing/app-credentials/

---

## 🎊 Next Steps After Launch

Once your app is live:

1. **Monitor Reviews**: Respond to user feedback
2. **Analytics**: Set up Firebase/Analytics to track usage
3. **Updates**: Release updates regularly
4. **Marketing**: Promote your app
5. **Support**: Provide user support via email

---

Good luck with your Play Store launch! 🚀📱
