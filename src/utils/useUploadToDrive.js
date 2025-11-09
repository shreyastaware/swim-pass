import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Custom hook to upload images to Google Drive
 * Handles both native and web platforms
 */
function useUploadToDrive() {
  const [loading, setLoading] = React.useState(false);

  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);

      let base64Data;
      let fileName = `visitor-${Date.now()}.jpg`;

      // Handle React Native asset with URI
      if ('reactNativeAsset' in input && input.reactNativeAsset) {
        const asset = input.reactNativeAsset;
        const uri = asset.uri;
        fileName = asset.name || fileName;

        // Check if URI is already a data URL (web platform)
        if (uri.startsWith('data:')) {
          base64Data = uri;
        } else if (Platform.OS === 'web') {
          // On web, try to fetch the blob and convert to base64
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            base64Data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error reading web file:', error);
            throw new Error('Failed to read image file on web');
          }
        } else {
          // Native platform - use FileSystem
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const mimeType = asset.mimeType || 'image/jpeg';
            base64Data = `data:${mimeType};base64,${base64}`;
          } catch (error) {
            console.error('Error reading native file:', error);
            throw new Error('Failed to read image file on native');
          }
        }
      } else if ('base64' in input) {
        // Direct base64 input
        base64Data = input.base64;
        fileName = input.name || fileName;
      } else if ('uri' in input) {
        // URI input
        const uri = input.uri;

        // Check if already data URL
        if (uri.startsWith('data:')) {
          base64Data = uri;
        } else if (Platform.OS === 'web') {
          // Web platform
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            base64Data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error reading web file:', error);
            throw new Error('Failed to read image file on web');
          }
        } else {
          // Native platform
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            base64Data = `data:image/jpeg;base64,${base64}`;
          } catch (error) {
            console.error('Error reading native file:', error);
            throw new Error('Failed to read image file on native');
          }
        }
        fileName = input.name || fileName;
      } else {
        throw new Error('Invalid input format. Expected reactNativeAsset, base64, or uri');
      }

      // Upload to our API endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64Data,
          name: fileName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return {
        url: data.url,
        fileId: data.fileId,
        webViewLink: data.webViewLink,
      };
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      if (uploadError instanceof Error) {
        return { error: uploadError.message };
      }
      if (typeof uploadError === 'string') {
        return { error: uploadError };
      }
      return { error: 'Upload failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }];
}

export { useUploadToDrive };
export default useUploadToDrive;
