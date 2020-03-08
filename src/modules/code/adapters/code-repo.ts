import Code from '../models/code';

export default interface CodeRepo {
  getAll(): Promise<Code[]>;
  addCodes(codes: Code[]): Promise<void>;
}
