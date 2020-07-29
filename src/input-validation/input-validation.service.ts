import joi, { ValidationErrorItem } from "joi";
import { InputError } from "./input-validation.middleware";

export class InputValidationService {
    public async validate(input, schema) {
        let result;
        try {
            result = await joi.validate(input, schema);
        }
        catch (error) {
            if (!error.details)
                throw error;

            const status = 400;

            const mapError: Function = (err: ValidationErrorItem) => {
                const error: InputError = {
                    key: (err.context || {}).key,
                    label: (err.context || {}).label,
                    type: err.type
                };
                return error;
            };

            throw { status, message: 'Invalid input', err: { details: error.details.map(mapError) } };
        }

        return result;
    }
}
