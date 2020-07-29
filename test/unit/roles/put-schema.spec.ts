import { RoleSchema } from "../../../src/auth/roles/role.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Put Role schema', () => {
    const roleSchema = new RoleSchema(InputValidation.BaseSchema);
    const schema = roleSchema.schemas.putRole;

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

        it('if users is in a wrong format', async () => {
            const input = { name: 'asd', users: [1,2,3] };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 3);
                details[0].key.should.be.exactly(0);
                details[0].type.should.be.exactly('object.base');

                details[1].key.should.be.exactly(1);
                details[1].type.should.be.exactly('object.base');

                details[2].key.should.be.exactly(2);
                details[2].type.should.be.exactly('object.base');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { name: 'asd', users: [{id: 1}] };

        await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
    });
});