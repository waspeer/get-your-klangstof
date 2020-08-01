export function createMockAssetRepository() {
  return {
    findById: jest.fn(),
    store: jest.fn(),
  };
}
