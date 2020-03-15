interface SuccesResponse {
  statusCode: number;
}

interface FailureResponse {
  statusCode: number;
  error: string;
  message: string;
}

export type ApiResponse = SuccesResponse | FailureResponse;

interface Succes {
  succes: true;
}

export interface Error<T extends string> {
  succes: false;
  error: T;
  message: string;
}

export type Result = Succes | Error;
