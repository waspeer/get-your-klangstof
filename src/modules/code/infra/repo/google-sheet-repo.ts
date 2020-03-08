import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import Code from '../../models/code';
import CodeMapper from '../../mappers/code-mapper';
import CodeRepo from '../../adapters/code-repo';

export interface StoredCode {
  code: string;
  used: string;
}

class GoogleSheetRepo implements CodeRepo {
  constructor(private sheet: Promise<GoogleSpreadsheetWorksheet>) {}

  async addCodes(codes: Code[]): Promise<void> {
    const sheet = await this.sheet;
    return new Promise<void>((resolve) => {
      sheet.addRows(codes.map(CodeMapper.toPersistence)).then(() => resolve());
    });
  }

  async getAll(): Promise<Code[]> {
    const sheet = await this.sheet;
    const rows = await sheet.getRows<StoredCode>();
    return rows.map(CodeMapper.toDomain);
  }

  async getCode(codeString: string) {
    const sheet = await this.sheet;
    const rows = await sheet.getRows<StoredCode>();
    const codeRow = rows.find((row) => row.code === codeString);

    if (!codeRow) throw new Error('unable to get code: row could not be found');

    const { code, used } = codeRow;

    return Code.create({
      code,
      used: +used,
    }).value;
  }

  async updateCode(code: Code): Promise<void> {
    const sheet = await this.sheet;
    const rows = await sheet.getRows<StoredCode>();
    const rowToUpdate = rows.find((row) => row.code === code.code);

    if (!rowToUpdate) throw new Error('unable to update row: row could not be found');

    rowToUpdate.code = code.code;
    rowToUpdate.used = String(code.used);

    return new Promise((resolve) => {
      rowToUpdate.save().then(resolve);
    });
  }
}

export default GoogleSheetRepo;
