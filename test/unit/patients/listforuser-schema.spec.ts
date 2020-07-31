import { PatientSchema } from "../../../src/patients/patient.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('List Patients for User schema', () => {
    const patientSchema = new PatientSchema(InputValidation.BaseSchema);
    const schema = patientSchema.schemas.listForUser;

    const validParams = { userId: 1 };

    beforeEach(() => {
        sinon.restore();
    });

    describe('should throw a bad request', () => {
        it('if params is missing', async () => {
            try {
                await SchemaTests.runValidationInput(schema, {});
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('body');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if userId is missing', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: {} });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('userId');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if userId is less than 1', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: { userId: 0 } });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('userId');
                details[0].type.should.be.exactly('number.min');
            }
        });
    });

    it('should pass on valid schema', async () => {
        await SchemaTests.runValidationInput(schema, { params: validParams });
    });
});