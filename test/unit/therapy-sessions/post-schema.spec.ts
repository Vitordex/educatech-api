import { TherapySessionSchema } from "../../../src/therapy-sessions/therapy-session.schema";
import { SchemaTests } from '../schema.tests';

import sinon from 'sinon';
import { InputValidation } from "../../../src/input-validation/input-validation.middleware";

describe('Post TherapySession schema', () => {
    const therapySessionSchema = new TherapySessionSchema(InputValidation.BaseSchema);
    const schema = therapySessionSchema.schemas.postTherapySession;

    beforeEach(() => {
        sinon.restore();
    });

    describe('should throw a bad request', () => {
        it('if body is missing', async () => {
            try {
                await SchemaTests.runValidationInput(schema, {});
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('body');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if patientId is missing', async () => {
            const input = { sessionSummary: 'aadgadg', parentsRecommendation: 'adgadgadg' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('patientId');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if patientId is less than 1', async () => {
            const input = { sessionSummary: 'adgadgadg', parentsRecommendation: 'adgadgadg', patientId: 0 };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('patientId');
                details[0].type.should.be.exactly('number.min');
            }
        });

        it('if sessionSummary is missing', async () => {
            const input = { patientId: 1, parentsRecommendation: 'adgadgadg' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('sessionSummary');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if sessionSummary is empty', async () => {
            const input = { patientId: 1, sessionSummary: '', parentsRecommendation: 'adgadgadg' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('sessionSummary');
                details[0].type.should.be.exactly('any.empty');
            }
        });

        it('if parentsRecommendation is missing', async () => {
            const input = { patientId: 1, sessionSummary: 'adgadgadg' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('parentsRecommendation');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('if parentsRecommendation is empty', async () => {
            const input = { patientId: 1, sessionSummary: 'adadvadv', parentsRecommendation: '' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('parentsRecommendation');
                details[0].type.should.be.exactly('any.empty');
            }
        });

        it('if userId is sent', async () => {
            const input = { patientId: 1, userId: 1, sessionSummary: 'adadvadv', parentsRecommendation: 'aonvdnkadv' };

            try {
                await SchemaTests.runValidation(schema, input);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('userId');
                details[0].type.should.be.exactly('any.unknown');
            }
        });
    });

    it('should pass on valid schema', async () => {
        const input = { patientId: 1, sessionSummary: 'adadvadv', parentsRecommendation: 'aonvdnkadv' };

        await SchemaTests.runValidationInput(schema, { body: input });
    });
});