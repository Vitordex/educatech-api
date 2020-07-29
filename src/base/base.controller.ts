export default class BaseController {
    public throwError(status: API_STATUS, message: string, error?: Error) {
        throw { status, message, err: error };
    }

    public putChangeValue<T>(oldValue: T, newValue: T) {
        const isValidAndDifferentValue = this.isValidAndDiferentValue(newValue, oldValue);
        if(isValidAndDifferentValue) return newValue;

        return oldValue;
    }

    public isValidAndDiferentValue<T>(input: T, persisted: T){
        return !!input && input !== persisted;
    }
}

export enum API_STATUS {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    PARTIAL_CONTENT = 206,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500
}