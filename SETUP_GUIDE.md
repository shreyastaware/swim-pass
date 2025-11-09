# Swim Pass App - Setup Guide

## Google Sheets & Google Drive API Integration Setup

This guide will help you set up Google Sheets and Google Drive integration for your Swim Pass visitor management app.

---

## 1. Set Up Google Cloud Project

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it (e.g., "Swim Pass App") and click **"Create"**
4. Wait for the project to be created and select it

### Step 2: Enable Required APIs
1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for and enable the following APIs:
   - **Google Sheets API** - Click "Enable"
   - **Google Drive API** - Click "Enable"

---

## 2. Create API Key for Google Sheets

### Step 1: Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key (save it for later)
4. **(Important)** Click **"Edit API Key"** to restrict it:
   - Under "API restrictions", select **"Restrict key"**
   - Check **"Google Sheets API"** only
   - Click **"Save"**

---

## 3. Create Service Account for Google Drive

### Step 1: Create Service Account
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Enter a name (e.g., "Swim Pass Service Account")
4. Click **"Create and Continue"**
5. Skip the optional steps and click **"Done"**

### Step 2: Create Service Account Key
1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"** - a JSON file will be downloaded
7. **IMPORTANT:** Keep this file secure! It contains private credentials

### Step 3: Get Service Account Email
1. Open the downloaded JSON file
2. Find the `"client_email"` field - it looks like:
   ```
   your-service-account@your-project.iam.gserviceaccount.com
   ```
3. Copy this email address - you'll need it for Drive folder sharing

---

## 4. Create Your Google Spreadsheet

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

## 5. Set Up Google Drive Folder (Optional but Recommended)

### Step 1: Create a Drive Folder
1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder (e.g., "Swim Pass Photos")
3. Right-click the folder → **"Get link"**
4. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

### Step 2: Share Folder with Service Account
1. Right-click the folder → **"Share"**
2. Paste your service account email (from Step 3.3 above)
3. Give it **"Editor"** permission
4. Uncheck **"Notify people"**
5. Click **"Share"**

**Why?** This allows your service account to upload images to this specific folder.

---

## 6. Configure Environment Variables

### Step 1: Prepare Service Account JSON
1. Open the downloaded JSON key file
2. Copy the ENTIRE contents (it should be one long line of JSON)
3. You can use an online JSON minifier to make it a single line if needed

### Step 2: Edit the `.env` file in the root directory:

```bash
# REQUIRED: Your Google Sheets API Key
EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSy...your_api_key_here

# REQUIRED: Your Google Spreadsheet ID
EXPO_PUBLIC_GOOGLE_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j...your_spreadsheet_id

# REQUIRED: Your Service Account JSON (entire JSON as one line)
EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}

# OPTIONAL: Your Google Drive Folder ID
EXPO_PUBLIC_GOOGLE_DRIVE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j...your_folder_id
```

### Important Notes:
- The service account JSON must be on ONE line
- Keep the JSON format intact (with all quotes and braces)
- Never commit this file to Git (.gitignore already protects it)

---

## 7. Test the Integration

### Start the development server:
```bash
npm start
```

### Test the app:
1. Fill out the visitor entry form
2. Take a photo
3. Submit the form
4. Check your Google Spreadsheet - the entry should appear!
5. Check your Google Drive folder - the photo should be uploaded!

### Test the admin dashboard:
1. Navigate to **Admin Login** (you may need to add a button or manually navigate to `/admin-login`)
2. Enter password: **`admin123`**
3. View all visitor entries fetched from Google Sheets
4. Photos should be displayed from Google Drive URLs

---

## Troubleshooting

### Error: "Failed to save visitor entry"
- ✅ Check that your API key is correct
- ✅ Verify Google Sheets API is enabled in Cloud Console
- ✅ Ensure spreadsheet is shared publicly (anyone with link)
- ✅ Check spreadsheet ID is correct

### Error: "Failed to upload image to Google Drive"
- ✅ Verify Google Drive API is enabled
- ✅ Check service account JSON is valid and properly formatted
- ✅ Ensure service account has access to the Drive folder (shared as Editor)
- ✅ Check folder ID is correct (if using a specific folder)
- ✅ Make sure the JSON is on ONE line in the .env file

### Images not uploading
- ✅ Verify `EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly
- ✅ Check the service account has "Editor" permission on the Drive folder
- ✅ Ensure the private key in the JSON is not corrupted
- ✅ Check browser console/terminal for detailed error messages

### JSON formatting issues
- The service account JSON must be valid JSON on one line
- Use an online JSON validator to check if it's valid
- Make sure to escape special characters if needed
- Example valid format:
  ```
  EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"test"}
  ```

---

## How It Works

### Image Upload Flow:
1. User takes a photo with the camera
2. Photo is stored locally on the device
3. On submit, the photo is converted to base64
4. Base64 is sent to `/api/upload-image` endpoint
5. Server uploads the image to Google Drive using Service Account
6. Google Drive returns a public URL
7. The URL is saved to Google Sheets (not the actual image)

### Data Storage:
- **Google Sheets:** Stores visitor information (name, mobile, address, etc.) + photo URL
- **Google Drive:** Stores the actual photo files
- **Admin Dashboard:** Fetches data from Google Sheets and displays photos from Drive URLs

---

## App Structure

### Visitor Flow (No Login):
1. **Visitor Entry Form** (`/visitor-entry`) - Fill name, mobile, address, etc.
2. **Photo Capture** (`/photo-capture`) - Take visitor photo
3. **Review & Submit** (`/review-submit`) - Upload to Drive & save to Sheets

### Admin Flow (Password Protected):
1. **Admin Login** (`/admin-login`) - Password: `admin123`
2. **Admin Dashboard** (`/admin-dashboard`) - View all entries from Google Sheets

---

## Security Notes

⚠️ **Important for Production:**
1. The admin password is currently hardcoded as `admin123`
2. Service account credentials are sensitive - never commit to Git
3. Consider implementing proper authentication before deploying
4. Restrict API keys to specific HTTP referrers in production
5. Use environment-specific credentials for dev/staging/prod

---

## Next Steps

After setting up the integration:
- ✅ Update app name and branding in `app.json`
- ✅ Add your app icons and splash screen
- ✅ Configure EAS Build for Play Store deployment
- ✅ Change admin password to something secure
- ✅ Test thoroughly before deploying
- ✅ Consider adding image compression for faster uploads
- ✅ Set up proper error logging and monitoring

---

## Helpful Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Expo Documentation](https://docs.expo.dev/)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)

---

Need help? Check the error logs in the console or reach out with specific error messages!
