export function createMockDomainEventEmitter() {
  return {
    emit: jest.fn(),
    on: jest.fn(),
  };
}
