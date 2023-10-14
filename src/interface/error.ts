export interface ExtendedError extends Error {
    statusCode: number,
    validationData?: string[] | null
}