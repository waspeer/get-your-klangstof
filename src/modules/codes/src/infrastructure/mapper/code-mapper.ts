import { Code } from '../../domain/entities/code';
import type { SheetCode } from '../google-sheets/types/sheet-code';
import { UUID } from '~root/lib/domain/uuid';

export class CodeMapper {
  static toDomain(sheetCode: SheetCode): Code {
    return new Code(
      {
        assetName: sheetCode.assetName,
        used: +sheetCode.used,
        useLimit: +sheetCode.useLimit,
      },
      new UUID(sheetCode.code),
    );
  }

  static toPersistence(code: Code): SheetCode {
    return {
      assetName: code.assetName,
      code: code.id.value,
      used: code.used,
      useLimit: code.useLimit,
    };
  }
}
