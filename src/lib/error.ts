export interface ErrorObject<T extends string> {
  type: T;
  message: string;
  error?: any;
}

export default {
  createFactory<T extends string>(type: T) {
    return (message: string, error?: any): ErrorObject<T> => ({ type, message, error });
  },
  create<T extends string>(type: T, message: string, error?: any): ErrorObject<T> {
    return { type, message, error };
  },
};
