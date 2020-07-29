import BaseSchema from '../../../src/base/base.schema';
import { InputValidation } from '../../../src/input-validation/input-validation.middleware';
import { SchemaTests } from '../schema.tests';

describe('Base Schema tests', () => {
    describe('paramsObjectId method', () => {
        class ParamsIdSchema extends BaseSchema {
            public get schemas(): any {
                return {
                    test: this.generateSchema({
                        params: this.paramsObjectId()
                    })
                };
            }
        }
        const schemaType = new ParamsIdSchema(InputValidation.BaseSchema);
        const schema = schemaType.schemas.test;
        
        it('should throw Bad Request if empty params', async () => {
            try {
                await SchemaTests.runValidation(schema);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('params');
                details[0].type.should.be.exactly('any.required');
            }
        });

        it('should throw Bad Request if params with invalid keys', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: { id: 1, alo: 'test' } });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('alo');
                details[0].type.should.be.exactly('object.allowUnknown');
            }
        });

        it('should throw Bad Request if id is zero', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: { id: 0 } });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('id');
                details[0].type.should.be.exactly('number.positive');
            }
        });

        it('should throw Bad Request if id is no number', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: { id: true } });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('id');
                details[0].type.should.be.exactly('number.base');
            }
        });

        it('should throw Bad Request if id is negative', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { params: { id: -1 } });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('id');
                details[0].type.should.be.exactly('number.positive');
            }
        });
    });

    describe('queryAuthSchema method', () => {
        class QueryAuthSchema extends BaseSchema {
            public get schemas(): any {
                return {
                    test: this.generateSchema({
                        query: this.queryAuthSchema()
                    })
                };
            }
        }
        const schemaType = new QueryAuthSchema(InputValidation.BaseSchema);
        const schema = schemaType.schemas.test;

        it('should throw Bad Request if token is not a string', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { 
                    query: { 
                        authorization: 0
                    } 
                });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('authorization');
                details[0].type.should.be.exactly('string.base');
            }
        });

        it('should throw Bad Request if no token was sent', async () => {
            try {
                await SchemaTests.runValidationInput(schema, { 
                    query: {
                        ok: 'ok'
                    } 
                });

                (true).should.equal(false);
            } catch (error) {
                const details = SchemaTests.testValidationError(error, 1);
                details[0].key.should.be.exactly('authorization');
                details[0].type.should.be.exactly('any.required');
            }
        });
    });
});