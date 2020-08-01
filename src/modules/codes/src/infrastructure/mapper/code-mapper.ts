import { Code } from '../../domain/value-objects/code';
import type { SheetCode } from '../google-sheets/types/sheet-code';

export class CodeMapper {
  static toDomain(sheetCode: SheetCode): Code {
    return new Code({
      assetName: sheetCode.assetName,
      value: sheetCode.code,
      used: sheetCode.used,
    });
  }

  static toPersistence(code: Code): SheetCode {
    return {
      assetName: code.assetName,
      code: code.value,
      used: code.used,
    };
  }
}
