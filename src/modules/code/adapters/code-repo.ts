import Code from '../models/code';

export default interface CodeRepo {
  addCodes(codes: Code[]): Promise<void>;
  getAll(): Promise<Code[]>;
  getCode(code: string): Promise<Code>;
  updateCode(code: Code): Promise<void>;
}
