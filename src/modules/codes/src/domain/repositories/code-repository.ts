import { Code } from '../value-objects/code';

export interface CodeRepository {
  store(code: Code | Code[]): Promise<void>;
}
