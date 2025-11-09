# Swim Pass App - Setup Guide

## Google Sheets API Integration Setup

This guide will help you set up the Google Sheets API integration for your Swim Pass visitor management app.

---

## 1. Set Up Google Cloud Project & Get API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it (e.g., "Swim Pass App") and click **"Create"**

### Step 2: Enable Google Sheets API
1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### Step 3: Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key (you'll need this for `.env` file)
4. **(Important)** Click **"Edit API Key"** to restrict it:
   - Under "API restrictions", select **"Restrict key"**
   - Check **"Google Sheets API"** only
   - Click **"Save"**

---

## 2. Create Your Google Spreadsheet

### Step 1: Create a New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it (e.g., "Swim Pass Visitor Entries")

### Step 2: Get Spreadsheet ID
The Spreadsheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```
Copy the ID between `/d/` and `/edit`

### Step 3: Make Spreadsheet Public (Important!)
1. Click **"Share"** button (top right)
2. Click **"Change to anyone with the link"**
3. Set permission to **"Viewer"**
4. Click **"Done"**

**Note:** The API will write to this sheet, but it needs to be publicly readable for the API key authentication to work.

---

## 3. Set Up Uploadcare (Image Uploads)

### Option 1: Use Uploadcare (Recommended)
1. Go to [Uploadcare](https://uploadcare.com/)
2. Sign up for a free account
3. Go to **Dashboard** → **API Keys**
4. Copy your **Public Key**

### Option 2: Skip Image Uploads (Testing)
If you want to test without images, you can use a placeholder:
```
EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY=placeholder
```

---

## 4. Configure Environment Variables

### Edit the `.env` file in the root directory:

```bash
# REQUIRED: Your Google Sheets API Key
EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSy...your_api_key_here

# REQUIRED: Your Google Spreadsheet ID
EXPO_PUBLIC_GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j...your_spreadsheet_id

# REQUIRED: Your Uploadcare Public Key
EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
```

---

## 5. Test the Integration

### Start the development server:
```bash
npm start
```

### Test the app:
1. Fill out the visitor entry form
2. Take a photo
3. Submit the form
4. Check your Google Spreadsheet - the entry should appear!

### Test the admin dashboard:
1. Navigate to **Admin Login** (you may need to add a button or manually navigate to `/admin-login`)
2. Enter password: **`admin123`**
3. View all visitor entries fetched from Google Sheets

---

## Troubleshooting

### Error: "Failed to save visitor entry"
- ✅ Check that your API key is correct
- ✅ Verify Google Sheets API is enabled in Cloud Console
- ✅ Ensure spreadsheet is shared publicly (anyone with link)
- ✅ Check spreadsheet ID is correct

### Error: "Upload failed"
- ✅ Verify Uploadcare public key is correct
- ✅ Check internet connection
- ✅ Try creating a new Uploadcare account

### Images not uploading
- The app uses Uploadcare for image storage
- Only the image URL is saved to Google Sheets, not the actual image
- Make sure `EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY` is set

---

## App Structure

### Visitor Flow (No Login):
1. **Visitor Entry Form** (`/visitor-entry`) - Fill name, mobile, address, etc.
2. **Photo Capture** (`/photo-capture`) - Take visitor photo
3. **Review & Submit** (`/review-submit`) - Review and submit to Google Sheets

### Admin Flow (Password Protected):
1. **Admin Login** (`/admin-login`) - Password: `admin123`
2. **Admin Dashboard** (`/admin-dashboard`) - View all entries from Google Sheets

---

## Security Notes

⚠️ **Important for Production:**
1. The admin password is currently hardcoded as `admin123`
2. Consider implementing proper authentication before deploying
3. Store sensitive credentials securely
4. Consider using Service Account authentication for Google Sheets (more secure than API key)

---

## Next Steps

After setting up the integration:
- ✅ Update app name and branding in `app.json`
- ✅ Add your app icons and splash screen
- ✅ Configure EAS Build for Play Store deployment
- ✅ Change admin password to something secure
- ✅ Test thoroughly before deploying

---

Need help? Check the [Expo documentation](https://docs.expo.dev/) or [Google Sheets API docs](https://developers.google.com/sheets/api/guides/concepts).
