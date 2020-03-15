import { Success } from './success';

describe('Success', () => {
  let success: Success;
  const value = 'the meaning of life';

  beforeEach(() => {
    success = new Success(value);
  });

  it('should construct', () => {
    expect(success).toBeInstanceOf(Success);
    expect(success.value).toBe(value);
  });

  it('should communicate identity', () => {
    expect(success.isFailure()).toBe(false);
    expect(success.isSuccess()).toBe(true);
  });
});
