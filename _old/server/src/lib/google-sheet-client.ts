/* eslint-disable @typescript-eslint/camelcase */
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

const getSheet = async () => {
  if (
    !process.env.GOOGLE_SHEET_ID ||
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
    throw new Error('GOOGLE SHEET: Credentials should be set in environment variables.');
  }

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\\u003d/g, '='),
  });

  await doc.loadInfo();

  return doc.sheetsByIndex[0] as GoogleSpreadsheetWorksheet;
};

export default getSheet;
