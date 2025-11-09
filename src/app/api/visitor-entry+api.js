import { GoogleSpreadsheet } from 'google-spreadsheet';

// Initialize Google Sheets
async function getSheet() {
  const doc = new GoogleSpreadsheet(
    process.env.EXPO_PUBLIC_GOOGLE_SPREADSHEET_ID,
    {
      apiKey: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY,
    }
  );

  await doc.loadInfo();

  // Get the first sheet or create one if it doesn't exist
  let sheet = doc.sheetsByIndex[0];

  if (!sheet) {
    sheet = await doc.addSheet({
      headerValues: [
        'Timestamp',
        'Name',
        'Mobile',
        'Address',
        'Purpose of Visit',
        'Meeting With',
        'Member Type',
        'Photo URL',
      ],
    });
  }

  return sheet;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, mobile, address, purposeOfVisit, whoMeeting, memberType, photoUrl } = body;

    // Validate required fields
    if (!name || !mobile || !address || !purposeOfVisit || !memberType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the sheet
    const sheet = await getSheet();

    // Add a new row
    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      Name: name,
      Mobile: mobile,
      Address: address,
      'Purpose of Visit': purposeOfVisit,
      'Meeting With': whoMeeting || '',
      'Member Type': memberType,
      'Photo URL': photoUrl || '',
    });

    return Response.json(
      { message: 'Visitor entry saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return Response.json(
      { error: 'Failed to save visitor entry', details: error.message },
      { status: 500 }
    );
  }
}
