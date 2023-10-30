export class ExtendedError extends Error {
    constructor(message, statusCode, validationData) {
        super(message);
        this.statusCode = statusCode;
        this.validationData = validationData;
    }
}
