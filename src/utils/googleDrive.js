import { google } from 'googleapis';

/**
 * Initialize Google Drive API client with Service Account credentials
 */
function getDriveClient() {
  // Parse the service account JSON from environment variable
  const serviceAccountKey = JSON.parse(
    process.env.EXPO_PUBLIC_GOOGLE_SERVICE_ACCOUNT_KEY || '{}'
  );

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
    const drive = getDriveClient();
    const folderId = process.env.EXPO_PUBLIC_GOOGLE_DRIVE_FOLDER_ID;

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

    // Upload the file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id;

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Generate public URL
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return {
      url: publicUrl,
      fileId: fileId,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
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
