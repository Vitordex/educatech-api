import { API_STATUS } from "./api-status";

export class ApiFunctions {
    public static throwError(status: API_STATUS, message: string, error?: Error) {
        throw { status, message, err: error };
    }
}