import { InputValidation, InputObject } from '../../src/input-validation/input-validation.middleware';
import should from 'should';

export class SchemaTests {
    public static get validation() {
        return new InputValidation();
    }
    
    public static testValidationError(error, length) {
        should.equal(error['0'], 400);
        should.equal(error['1'], 'Invalid input');
        error['2'].should.have.property('details').with.lengthOf(length);
        const { details } = error['2'];
        return details;
    }
    
    public static runValidation(schema, body?, query?, params?, headers?) {
        const context = {
            request: { body, query, headers },
            params,
            throw: (...params) => { throw { ...params }; }
        } as any;
        return this.validation.validate(schema)(context, Promise.resolve);
    }
    
    public static runValidationInput(schema, input: InputObject) {
        const context = {
            request: { body: input.body, query: input.query, headers: input.headers },
            params: input.params,
            throw: (...params) => { throw { ...params }; }
        } as any;
        return this.validation.validate(schema)(context, () => Promise.resolve());
    }
}
