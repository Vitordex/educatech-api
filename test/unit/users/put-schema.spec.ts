import { UserSchema } from "../../../src/auth/users/user.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Put User schema', () => {
    const userSchema = new UserSchema(InputValidation.BaseSchema);
    const schema = userSchema.schemas.putUser;

    const validParams = { id: 1 };

    beforeEach(() => {
        sinon.restore();
    });

    describe('should throw a bad request', () => {
        it('if body is missing', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('body');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if no item was sent', async () => {
            const input = { body: {}, params: validParams };

            try {
                await SchemaTests.runValidationInput(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('body');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if email is in a wrong format', async () => {
            const input = { name: 'asd', email: 'apdov', password: '123456', roleId: 1 };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('email');
                details[0].type.should.be.exactly('string.email');
            }
        });

        it('if birthDay less than min', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', gender: 0, birthDay: new Date(1899, 12, 12) };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('birthDay');
                details[0].type.should.be.exactly('date.min');
            }
        });

        it('if gender is more than max', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', birthDay: new Date(2000, 1, 1), gender: 10 };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('gender');
                details[0].type.should.be.exactly('number.max');
            }
        });

        it('if gender is less than min', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', birthDay: new Date(2000, 1, 1), gender: -1 };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('gender');
                details[0].type.should.be.exactly('number.min');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { name: 'asd', email: 'teste@email.com', password: '123456' };

        await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
    });
});