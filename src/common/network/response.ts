export type FailedOperationResponse = {
    readonly isSuccess: false;
    readonly error: string;
};

export type SuccessOperationResponse<T = void> = T extends void
    ? {
          readonly isSuccess: true;
      }
    : {
          readonly isSuccess: true;
          readonly response: T;
      };

export type Response<T = void> = FailedOperationResponse | SuccessOperationResponse<T>;

export function isFailedOperationResult<T>(result: Response<T>): result is FailedOperationResponse {
    return !result.isSuccess;
}

export function isSuccessOperationResult<T = unknown>(
    result: Response<T>
): result is SuccessOperationResponse<T> {
    return result.isSuccess;
}
