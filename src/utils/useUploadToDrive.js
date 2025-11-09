import * as React from 'react';
import * as FileSystem from 'expo-file-system';

/**
 * Custom hook to upload images to Google Drive
 * Converts React Native image URIs to base64 and uploads to Drive
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

        // Read the file as base64
        try {
          base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Add the data URL prefix based on mime type
          const mimeType = asset.mimeType || 'image/jpeg';
          base64Data = `data:${mimeType};base64,${base64Data}`;
        } catch (error) {
          console.error('Error reading file:', error);
          throw new Error('Failed to read image file');
        }
      } else if ('base64' in input) {
        // Direct base64 input
        base64Data = input.base64;
        fileName = input.name || fileName;
      } else if ('uri' in input) {
        // URI input (convert to base64)
        try {
          const base64 = await FileSystem.readAsStringAsync(input.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Data = `data:image/jpeg;base64,${base64}`;
          fileName = input.name || fileName;
        } catch (error) {
          console.error('Error reading file:', error);
          throw new Error('Failed to read image file');
        }
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
