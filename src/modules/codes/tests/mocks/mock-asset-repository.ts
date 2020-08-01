export function createMockAssetRepository() {
  return {
    findById: jest.fn(),
    findByName: jest.fn(),
    store: jest.fn(),
  };
}
