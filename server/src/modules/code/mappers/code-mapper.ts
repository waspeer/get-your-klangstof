import DTO from '../adapters/code-dto';
import { StoredCode } from '../infra/repo/google-sheet-repo';
import Code from '../models/code';

class CodeMapper {
  static toDomain({ code, used }: StoredCode): Code {
    const result = Code.create({ code, used: +used });
    return result.value;
  }

  static toDTO({ code, isValid }: Code): DTO {
    return {
      code,
      valid: isValid,
    };
  }

  static toPersistence({ code, used }: Code): StoredCode {
    return {
      code,
      used: String(used),
    };
  }
}

export default CodeMapper;
