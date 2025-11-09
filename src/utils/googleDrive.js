import { google } from 'googleapis';

/**
 * Initialize Google Drive API client with Service Account credentials
 */
function getDriveClient() {
  console.log('[googleDrive] Initializing Drive client...');

  // Check if service account key is set
  if (!process.env.EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.error('[googleDrive] EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY is not set');
    throw new Error('Google Service Account credentials not configured. Please set EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY in .env file');
  }

  // Parse the service account JSON from environment variable
  let serviceAccountKey;
  try {
    serviceAccountKey = JSON.parse(process.env.EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY);
    console.log('[googleDrive] Service account project:', serviceAccountKey.project_id);
    console.log('[googleDrive] Service account email:', serviceAccountKey.client_email);
  } catch (error) {
    console.error('[googleDrive] Failed to parse service account JSON:', error);
    throw new Error('Invalid service account JSON. Please check your EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY format');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Upload an image to Google Drive
 * @param {Object} fileData - The file data containing buffer and metadata
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadImageToDrive(fileData) {
  try {
    console.log('[googleDrive] uploadImageToDrive called with:', {
      name: fileData.name,
      mimeType: fileData.mimeType,
      hasStream: !!fileData.stream
    });

    const drive = getDriveClient();
    const folderId = process.env.EXPO_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;

    if (folderId) {
      console.log('[googleDrive] Using folder ID:', folderId);
    } else {
      console.log('[googleDrive] No folder ID specified, uploading to root');
    }

    // Create file metadata
    const fileMetadata = {
      name: fileData.name || `visitor-${Date.now()}.jpg`,
      parents: folderId ? [folderId] : undefined,
    };

    // Create media data
    const media = {
      mimeType: fileData.mimeType || 'image/jpeg',
      body: fileData.stream,
    };

    console.log('[googleDrive] Creating file in Drive...');

    // Upload the file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id;
    console.log('[googleDrive] File created with ID:', fileId);

    // Make the file publicly accessible
    console.log('[googleDrive] Making file public...');
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Generate public URL
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    console.log('[googleDrive] Public URL:', publicUrl);

    return {
      url: publicUrl,
      fileId: fileId,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('[googleDrive] Error uploading to Google Drive:', error);
    console.error('[googleDrive] Error details:', error.message);
    if (error.response) {
      console.error('[googleDrive] API Response:', error.response.data);
    }
    throw new Error('Failed to upload image to Google Drive: ' + error.message);
  }
}

/**
 * Delete a file from Google Drive
 * @param {string} fileId - The ID of the file to delete
 */
export async function deleteFileFromDrive(fileId) {
  try {
    const drive = getDriveClient();
    await drive.files.delete({ fileId });
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw new Error('Failed to delete file from Google Drive: ' + error.message);
  }
}
