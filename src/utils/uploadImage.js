// Create this as src/utils/uploadImage.js
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (imageUri) => {
  try {
    // 1. Read the file as Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileName = imageUri.split('/').pop();

    // 2. Send to YOUR specific API endpoint
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data: base64,
        name: fileName,
        uri: imageUri // Your API checks for this too
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    return result; // Should return { url, fileId, webViewLink }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};