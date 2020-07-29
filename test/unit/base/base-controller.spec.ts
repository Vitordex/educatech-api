import BaseController, { API_STATUS } from '../../../src/base/base.controller';

import should from 'should';

describe('Base controller Tests', () => {
    const baseController = new BaseController();
    should.toString();

    describe('isValidAndDiferentValue generic method', () => {
        const persistedValue = 'persisted';

        it('should return false with empty value', () => {
            baseController.isValidAndDiferentValue(undefined, persistedValue).should.be.false();
            baseController.isValidAndDiferentValue(null, persistedValue).should.be.false();
            baseController.isValidAndDiferentValue('', persistedValue).should.be.false();
        });

        it('should return false with same value', () => {
            baseController.isValidAndDiferentValue(persistedValue, persistedValue).should.be.false();
        });

        it('should return true with different value', () => {
            baseController.isValidAndDiferentValue('teste', persistedValue).should.be.true();
        });
    });

    describe('putChangeValue generic method', () => {
        const oldValue = 'oldValue';

        it('should return new value if valid and different', () => {
            baseController.putChangeValue(oldValue, 'teste').should.equal('teste');
        });
    });

    describe('throwError method', () => {
        const errorMessage = 'teste';
        it('should throw bad request', () => {
            try {
                baseController.throwError(API_STATUS.BAD_REQUEST, errorMessage);
            } catch (error) {
                error.status.should.equal(API_STATUS.BAD_REQUEST);
                error.message.should.equal(errorMessage);
                should.equal(error.err, undefined);
            }
        });

        it('should throw internal error', () => {
            try {
                baseController.throwError(API_STATUS.INTERNAL_ERROR, errorMessage);
            } catch (error) {
                error.status.should.equal(API_STATUS.INTERNAL_ERROR);
                error.message.should.equal(errorMessage);
                should.equal(error.err, undefined);
            }
        });

        it('should throw conflict', () => {
            try {
                baseController.throwError(API_STATUS.CONFLICT, errorMessage);
            } catch (error) {
                error.status.should.equal(API_STATUS.CONFLICT);
                error.message.should.equal(errorMessage);
                should.equal(error.err, undefined);
            }
        });

        it('should throw unauthorized', () => {
            try {
                baseController.throwError(API_STATUS.UNAUTHORIZED, errorMessage);
            } catch (error) {
                error.status.should.equal(API_STATUS.UNAUTHORIZED);
                error.message.should.equal(errorMessage);
                should.equal(error.err, undefined);
            }
        });

        it('should throw forbidden', () => {
            try {
                baseController.throwError(API_STATUS.FORBIDDEN, errorMessage);
            } catch (error) {
                error.status.should.equal(API_STATUS.FORBIDDEN);
                error.message.should.equal(errorMessage);
                should.equal(error.err, undefined);
            }
        });

        class CustomError extends Error {}

        it('should pass error on throw', () => {
            const customError = new CustomError();
            try {
                baseController.throwError(API_STATUS.UNAUTHORIZED, errorMessage, customError);
            } catch (error) {
                error.status.should.equal(API_STATUS.UNAUTHORIZED);
                error.message.should.equal(errorMessage);
                should.equal(error.err, customError);
            }
        });
    });
});