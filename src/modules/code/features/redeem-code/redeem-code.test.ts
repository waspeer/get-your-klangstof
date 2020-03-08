import createFeature from './redeem-code';
import Code from '../../models/code';
import CodeRepo from '../../adapters/code-repo';

const codeString = 'blah';

const testCode = Code.create({
  code: codeString,
  used: 0,
}).value;

const mockRepo = ({
  updateCode: jest.fn(),
  getCode: () => testCode,
} as unknown) as CodeRepo;

const redeemCode = createFeature(mockRepo);

describe('RedeemCode', () => {
  it('should update the download code', async () => {
    const result = await redeemCode({ code: codeString });
    expect(result.isSuccess()).toBe(true);
    expect(testCode.used).toBe(1);
    expect(mockRepo.updateCode).toHaveBeenCalled();
  });
});
