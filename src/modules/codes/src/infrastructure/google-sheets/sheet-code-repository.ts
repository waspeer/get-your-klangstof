import type { CodeRepository } from '../../domain/repositories/code-repository';
import type { Code } from '../../domain/value-objects/code';
import { CodeMapper } from '../mapper/code-mapper';
import { SheetRepository } from './sheet-repository';
import type { SheetConfig } from './sheet-repository';
import type { SheetCode } from './types/sheet-code';
import type { Logger } from '~root/lib/logger';

interface Dependencies {
  codeSheetConfig: SheetConfig;
  logger: Logger;
}

export class SheetCodeRepository extends SheetRepository implements CodeRepository {
  private readonly logger: Logger;

  public constructor({ codeSheetConfig, logger }: Dependencies) {
    super({ config: codeSheetConfig });

    this.logger = logger;
  }

  public async find(code: string) {
    const sheet = await this.getSheet();
    const rows = await sheet.getRows<SheetCode>();
    const sheetCode = rows.find((row) => row.code === code);

    return sheetCode ? CodeMapper.toDomain(sheetCode) : undefined;
  }

  public async store(codeOrCodes: Code | Code[]) {
    const sheet = await this.getSheet();
    const sheetCodes = Array.isArray(codeOrCodes)
      ? codeOrCodes.map(CodeMapper.toPersistence)
      : [CodeMapper.toPersistence(codeOrCodes)];
    const rows = await sheet.getRows<SheetCode>();
    const codesToCreate = sheetCodes.filter(
      (sheetCode) => !rows.some((row) => sheetCode.code === row.code),
    );
    const codesToUpdate = sheetCodes.filter((sheetCode) => !codesToCreate.includes(sheetCode));

    if (codesToCreate.length) {
      await sheet.addRows(sheetCodes);

      this.logger.debug('SheetCodeRepository: %s codes sucessfully created', sheetCodes.length);
    }

    if (codesToUpdate.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const sheetCode of sheetCodes) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const existingCode = rows.find((row) => row.code === sheetCode.code)!;

        Object.entries(sheetCode).forEach(([key, value]) => {
          (existingCode as any)[key] = value;
        });

        // eslint-disable-next-line no-await-in-loop
        await existingCode.save();

        this.logger.debug('SheetCodeRepository: Code %s sucessfully updated', sheetCode.code);
      }
    }
  }
}
