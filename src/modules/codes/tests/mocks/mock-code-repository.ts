export function createMockCodeRepository() {
  return {
    findByAssetId: jest.fn(),
    findById: jest.fn(),
    store: jest.fn(),
  };
}
