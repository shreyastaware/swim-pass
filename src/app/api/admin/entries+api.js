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

  // Get the first sheet
  let sheet = doc.sheetsByIndex[0];

  if (!sheet) {
    // If no sheet exists, create one with headers
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

export async function GET(request) {
  try {
    // Get the sheet
    const sheet = await getSheet();

    // Load all rows
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    // Format the data
    const entries = rows.map((row) => ({
      timestamp: row.get('Timestamp'),
      name: row.get('Name'),
      mobile: row.get('Mobile'),
      address: row.get('Address'),
      purposeOfVisit: row.get('Purpose of Visit'),
      whoMeeting: row.get('Meeting With'),
      memberType: row.get('Member Type'),
      photoUrl: row.get('Photo URL'),
    }));

    // Sort by timestamp (newest first)
    entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return Response.json(
      { entries },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return Response.json(
      { error: 'Failed to fetch entries', details: error.message },
      { status: 500 }
    );
  }
}
