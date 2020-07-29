import { UserSchema } from "../../../src/auth/users/user.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Login schema', () => {
    const userSchema = new UserSchema(InputValidation.BaseSchema);
    const schema = userSchema.schemas.login;

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
            const input = { email: 'apdov@aeghio.com' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('password');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if email is in a wrong format', async () => {
            const input = { email: 'apdov', password: '123456' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('email');
                details[0].type.should.be.exactly('string.email');
            }
        });
    });
});