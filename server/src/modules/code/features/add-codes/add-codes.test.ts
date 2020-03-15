import CodeRepo from '../../adapters/code-repo';
import createFeature from './add-codes';

const mockRepo = ({
  addCodes: jest.fn(),
} as unknown) as CodeRepo;

const addCodes = createFeature(mockRepo);

describe('addCodes', () => {
  it('should call addCodes on the repo with the new codes', async () => {
    await addCodes();
    expect(mockRepo.addCodes).toHaveBeenCalled();
  });
});
