export class ApiError extends Error {
    constructor(error) {
        const message = error.response?.data?.message
            || error.response?.data?.error
            || error.message
            || 'An unexpected error occurred';

        super(message);
        this.name = 'ApiError';
        this.status = error.response?.status;
        this.data = error.response?.data;
    }
}

export const handleApiError = (error) => {
    throw new ApiError(error);
};
