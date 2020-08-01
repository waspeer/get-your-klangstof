/* eslint-disable @typescript-eslint/camelcase */
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

export interface SheetConfig {
  clientEmail: string;
  privateKey: string;
  sheetId: string;
  sheetIndex: number;
}

interface Dependencies {
  config: SheetConfig;
}

export abstract class SheetRepository {
  private readonly config: SheetConfig;
  protected sheet?: GoogleSpreadsheetWorksheet;

  public constructor({ config }: Dependencies) {
    this.config = config;
  }

  protected async getSheet(): Promise<GoogleSpreadsheetWorksheet> {
    if (!this.sheet) {
      const { clientEmail, privateKey, sheetId, sheetIndex } = this.config;
      const doc = new GoogleSpreadsheet(sheetId);

      await doc.useServiceAccountAuth({
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n').replace(/\\u003d/g, '='),
      });

      await doc.loadInfo();

      this.sheet = doc.sheetsByIndex[sheetIndex];
    }

    return this.sheet;
  }
}
