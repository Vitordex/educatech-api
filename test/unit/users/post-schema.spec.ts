import { UserSchema } from "../../../src/auth/users/user.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Post User schema', () => {
    const userSchema = new UserSchema(InputValidation.BaseSchema);
    const schema = userSchema.schemas.postUser;

    beforeEach(() => {
        sinon.restore();
    });

    describe('should throw a bad request', () => {
        it('if body is missing', async () => {
            try {
                await SchemaTests.runValidation(schema);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('body');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if password is missing', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', gender: 0, birthDay: new Date(2000, 1, 1) };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('password');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if gender is missing', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', birthDay: new Date(2000, 1, 1) };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('gender');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if gender is more than max', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', birthDay: new Date(2000, 1, 1), gender: 10 };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('gender');
                details[0].type.should.be.exactly('number.max');
            }
        });

        it('if gender is less than min', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', birthDay: new Date(2000, 1, 1), gender: -1 };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('gender');
                details[0].type.should.be.exactly('number.min');
            }
        });

        it('if birthDay is missing', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', gender: 0 };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('birthDay');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if birthDay less than min', async () => {
            const input = { name: 'asd', email: 'apdov@aeghio.com', password: '123456', gender: 0, birthDay: new Date(1899, 12, 12) };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('birthDay');
                details[0].type.should.be.exactly('date.min');
            }
        });

        it('if email is missing', async () => {
            const input = { name: 'asd', password: '123456', gender: 0, birthDay: new Date(1950, 12, 12) };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('email');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if email is in a wrong format', async () => {
            const input = { name: 'asd', email: 'apdov', password: '123456', roleId: 1, birthDay: new Date(2000, 1, 1), gender: 1 };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('email');
                details[0].type.should.be.exactly('string.email');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { name: 'asd', email: 'teste@email.com', password: '123456', birthDay: new Date(2000, 1, 1), gender: 1 };

        await SchemaTests.runValidationInput(schema, { body: input });
    });
});