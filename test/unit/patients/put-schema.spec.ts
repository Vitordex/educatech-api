import { PatientSchema } from "../../../src/patients/patient.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Put Patient schema', () => {
    const patientSchema = new PatientSchema(InputValidation.BaseSchema);
    const schema = patientSchema.schemas.putPatient;

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

        it('if birthDay less than min', async () => {
            const input = { name: 'asd', birthDay: new Date(1899, 12, 12) };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('birthDay');
                details[0].type.should.be.exactly('date.min');
            }
        });

        it('if isRegularSchool is true and schoolName is missing', async () => {
            const input = { name: 'asd', birthDay: new Date(1988, 12, 12), isRegularSchool: true };

            try {
                await SchemaTests.runValidationInput(schema, { body: input, params: validParams});
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('schoolName');
                details[0].type.should.be.exactly('any.required');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { name: 'asd', birthDay: new Date(1988, 12, 12), isRegularSchool: false };

        await SchemaTests.runValidationInput(schema, { body: input, params: validParams });
    });
});