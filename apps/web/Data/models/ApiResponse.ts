// Generic API Response type
export interface ApiResponse<T = any> {
    isSuccess: boolean;
    data?: T;
    error?: string;
    localizationKey?: string;
    timestamp: string;
}

// Non-generic API Response type for void operations
export interface BaseApiResponse {
    isSuccess: boolean;
    error?: string;
    localizationKey?: string;
    timestamp: string;
}

// Factory functions to match your C# static methods
export const ApiResponse = {
    // Generic success
    success: <T>(data: T): ApiResponse<T> => ({
        isSuccess: true,
        data,
        timestamp: new Date().toISOString(),
    }),

    // Generic failure
    fail: <T>(error: string = "", localizationKey: string = "null"): ApiResponse<T> => ({
        isSuccess: false,
        error,
        localizationKey,
        timestamp: new Date().toISOString(),
    }),

    // Non-generic success
    successBase: (): BaseApiResponse => ({
        isSuccess: true,
        timestamp: new Date().toISOString(),
    }),

    // Non-generic failure
    failBase: (error: string = "", localizationKey: string = "null"): BaseApiResponse => ({
        isSuccess: false,
        error,
        localizationKey,
        timestamp: new Date().toISOString(),
    }),
};

// Type guard helpers
export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
    return response && typeof response.isSuccess === 'boolean' && response.timestamp;
};

export const isSuccessfulResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { isSuccess: true; data: T } => {
    return response.isSuccess === true && response.data !== undefined;
};

export const isFailedResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { isSuccess: false; error: string } => {
    return response.isSuccess === false;
};

export type AxiosApiError<T> = {
    response: {
        data: T,
        status: number
    }
}