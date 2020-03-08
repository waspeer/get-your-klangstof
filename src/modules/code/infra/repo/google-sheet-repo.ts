import { GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

import Code from '../../models/code';
import CodeMapper from '../../mappers/code-mapper';
import CodeRepo from '../../adapters/code-repo';

export interface StoredCode {
  code: string;
  used: string;
}

class Api implements CodeRepo {
  constructor(private sheet: Promise<GoogleSpreadsheetWorksheet>) {}

  async getAll(): Promise<Code[]> {
    return this.sheet.then(async (sheet) => {
      const rows = ((await sheet.getRows()) as unknown) as (GoogleSpreadsheetRow & StoredCode)[];
      return rows.map(CodeMapper.toDomain);
    });
  }

  addCodes(codes: Code[]): Promise<void> {
    return this.sheet.then((sheet) => {
      return new Promise<void>((resolve) => {
        sheet.addRows(codes.map(CodeMapper.toPersistence)).then(() => resolve());
      });
    });
  }
}

export default Api;
