import Code from '../models/code';

export default interface CodeRepo {
  addCodes(codes: Code[]): Promise<void>;
  codeExists(code: string): Promise<boolean>;
  getAll(): Promise<Code[]>;
  getCode(code: string): Promise<Code>;
  updateCode(code: Code): Promise<void>;
}
