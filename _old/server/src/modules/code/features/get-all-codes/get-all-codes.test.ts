import createFeature from './get-all-codes';
import CodeRepo from '../../adapters/code-repo';

const signal = 'yayyy';

const mockRepo = ({
  getAll() {
    return signal;
  },
} as unknown) as CodeRepo;

const getAllCodes = createFeature(mockRepo);

describe('getAllCodes', () => {
  it('should return all codes ', async () => {
    const result = await getAllCodes();
    expect(result.value).toBe(signal);
  });
});
