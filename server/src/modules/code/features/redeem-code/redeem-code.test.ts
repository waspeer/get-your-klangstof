import Code from '../../models/code';
import CodeRepo from '../../adapters/code-repo';
import * as Errors from './errors';
import createFeature from './redeem-code';

const codeString = 'blah';

describe('RedeemCode', () => {
  it('should update the download code', async () => {
    const testCode = Code.create({
      code: codeString,
      used: 0,
    }).value;
    const mockRepo = ({
      codeExists: () => true,
      getCode: () => testCode,
      updateCode: jest.fn(),
    } as unknown) as CodeRepo;
    const redeemCode = createFeature(mockRepo);
    const result = await redeemCode({ code: codeString });

    expect(result.isSuccess()).toBe(true);
    expect(testCode.used).toBe(1);
    expect(mockRepo.updateCode).toHaveBeenCalled();
  });

  it('should error when the code does not exist', async () => {
    const testCode = Code.create({
      code: codeString,
      used: 0,
    }).value;
    const mockRepo = ({
      codeExists: () => false,
      getCode: () => testCode,
      updateCode: jest.fn(),
    } as unknown) as CodeRepo;
    const redeemCode = createFeature(mockRepo);
    const result = await redeemCode({ code: codeString });

    expect(result.isFailure()).toBe(true);
    expect(result.isFailure() && result.error).toEqual(Errors.notFound());
  });
});
