import { RoleSchema } from "../../../src/auth/roles/role.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Post Role schema', () => {
    const roleSchema = new RoleSchema(InputValidation.BaseSchema);
    const schema = roleSchema.schemas.postRole;

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

        it('if name is missing', async () => {
            const input = {test: 'test'};

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 2);
                details[0].key.should.be.exactly('name');
                details[0].type.should.be.exactly('any.required');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { name: 'asd' };

        await SchemaTests.runValidationInput(schema, { body: input });
    });
});