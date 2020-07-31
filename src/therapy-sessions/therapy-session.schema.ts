import joi from 'joi';
import BaseSchema from '../base/base.schema';

export class TherapySessionSchema extends BaseSchema {
    public get schemas() {
        return {
            getById: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId()
            }),
            deleteById: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId()
            }),
            list: this.generateSchema({
                headers: this.queryAuthSchema(),
                query: joi.object().keys({
                    start: joi.number().min(0).default(0),
                    length: joi.number().positive().default(10)
                }).default({ start: 0, length: 10 })
            }),
            listForUser: this.generateSchema({
                headers: this.queryAuthSchema(),
                query: joi.object().keys({
                    start: joi.number().min(0).default(0),
                    length: joi.number().positive().default(10)
                }).default({ start: 0, length: 10 }),
                params: joi.object().keys({
                    userId: joi.number().min(1).required()
                })
            }),
            postTherapySession: this.generateSchema({
                headers: this.queryAuthSchema(),
                body: joi.object().keys({
                    userId: joi.number().forbidden(),
                    patientId: joi.number().required().min(1),
                    sessionSummary: joi.string().required(),
                    parentsRecommendation: joi.string().required()
                }).required()
            }),
            putTherapySession: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId(),
                body: joi.object().keys({
                    userId: joi.number().forbidden(),
                    patientId: joi.number().min(1),
                    sessionSummary: joi.string(),
                    parentsRecommendation: joi.string()
                }).required()
            })
        };
    }
}
