import { uploadImageToDrive } from '@/utils/googleDrive';
import { Readable } from 'stream';

/**
 * API Route to upload images to Google Drive
 * Accepts base64 encoded images or file URIs from React Native
 */
export async function POST(request) {
  try {
    console.log('[upload-image] Starting image upload...');

    // Check if we have multipart form data or JSON
    const contentType = request.headers.get('content-type');
    console.log('[upload-image] Content-Type:', contentType);

    let imageData;
    let fileName;
    let mimeType = 'image/jpeg';

    if (contentType?.includes('application/json')) {
      // Handle base64 encoded image
      const body = await request.json();
      const { base64Data, uri, name } = body;

      console.log('[upload-image] Request body keys:', Object.keys(body));
      console.log('[upload-image] Base64 data length:', base64Data?.substring(0, 50) + '...');

      if (!base64Data && !uri) {
        console.error('[upload-image] Missing image data');
        return Response.json(
          { error: 'Missing image data (base64Data or uri required)' },
          { status: 400 }
        );
      }

      // If base64Data is provided, use it directly
      if (base64Data) {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        imageData = Buffer.from(base64Image, 'base64');
        console.log('[upload-image] Image buffer size:', imageData.length, 'bytes');
      } else if (uri) {
        // For React Native file URIs, we need to fetch the file
        // In a real app, you'd handle this differently
        console.error('[upload-image] URI uploads not supported');
        return Response.json(
          { error: 'URI uploads not supported in this route. Use base64Data instead.' },
          { status: 400 }
        );
      }

      fileName = name || `visitor-${Date.now()}.jpg`;

      // Try to detect mime type from base64 prefix
      if (base64Data?.includes('data:image/png')) {
        mimeType = 'image/png';
        fileName = fileName.replace(/\.[^.]+$/, '.png');
      }

      console.log('[upload-image] File name:', fileName, 'MIME type:', mimeType);
    } else {
      // Handle multipart form data (if needed in the future)
      console.error('[upload-image] Unsupported content type');
      return Response.json(
        { error: 'Multipart form uploads not yet implemented. Use JSON with base64Data.' },
        { status: 400 }
      );
    }

    // Create a readable stream from the buffer
    const stream = Readable.from(imageData);

    console.log('[upload-image] Uploading to Google Drive...');

    // Upload to Google Drive
    const result = await uploadImageToDrive({
      name: fileName,
      mimeType: mimeType,
      stream: stream,
    });

    console.log('[upload-image] Upload successful! File ID:', result.fileId);

    return Response.json(
      {
        success: true,
        url: result.url,
        fileId: result.fileId,
        webViewLink: result.webViewLink,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[upload-image] Error uploading image:', error);
    console.error('[upload-image] Error stack:', error.stack);
    return Response.json(
      { error: 'Failed to upload image', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
