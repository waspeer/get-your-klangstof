import * as DomainError from './domain-error';

describe('DomainError', () => {
  describe('.create', () => {
    it('should create a DomainError function when provided with strings', () => {
      const type = 'TEST_ERROR' as const;
      const message = 'everything is wrong!';

      const error = DomainError.create(type, message);

      expect(typeof error).toBe('function');
      expect(error()).toEqual({ type, message });
    });

    it('should create a DomainError function when provided with a message creator', () => {
      const type = 'TEST_ERROR' as const;
      const messageCreator = (thing: string) => `${thing} is wrong!`;
      const thing = 'all';

      const error = DomainError.create(type, messageCreator);

      expect(typeof error).toBe('function');
      expect(error(thing)).toEqual({ type, message: messageCreator(thing) });
    });
  });

  describe('.unexpected', () => {
    beforeAll(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      ((console.error as unknown) as jest.Mock).mockClear();
    });

    it('should create an error object', () => {
      const error = DomainError.unexpected();

      expect(error.type).toBe(DomainError.errorTypes.UNEXPECTED_ERROR);
      expect(error.message).toBeTruthy();
    });

    it('should accept the unexpected error as argument and add it to the DomainError', () => {
      const e = new Error('so much wrongness!');
      const error = DomainError.unexpected(e);

      expect(error.error).toBe(e);
    });

    it('should log the error to the console', () => {
      DomainError.unexpected();

      expect(console.error).toHaveBeenCalled();
    });
  });
});
