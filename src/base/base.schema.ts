import joi, { ObjectSchema, SchemaMap } from 'joi';

export default abstract class BaseSchema {
    private baseSchema: ObjectSchema;

    constructor(baseSchema: ObjectSchema) {
        this.baseSchema = baseSchema;
    }

    protected generateSchema(keys: SchemaMap | undefined = {}) {
        if (!keys.headers) keys.headers = joi.object().unknown();

        return this.baseSchema.keys(keys);
    }

    protected queryAuthSchema(extension?: SchemaMap) {
        return joi.object().keys({
            authorization: joi.string().regex(/Bearer .+/).required(),
            ...extension
        }).unknown(true);
    }

    protected paramsObjectId(extension?: SchemaMap) {
        return joi.object().keys({
            id: joi.number().positive().required(),
            ...extension
        }).required();
    }

    public abstract get schemas(): {[key: string]: ObjectSchema};
}