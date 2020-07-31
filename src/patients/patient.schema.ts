import joi from 'joi';
import BaseSchema from '../base/base.schema';

export class PatientSchema extends BaseSchema {
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
            postPatient: this.generateSchema({
                headers: this.queryAuthSchema(),
                body: joi.object().keys({
                    name: joi.string().required(),
                    birthDay: joi.date().min(new Date(1900, 1, 1)).required(),
                    userId: joi.number().forbidden(),
                    isActive: joi.bool().default(true),
                    isRegularSchool: joi.bool().required(),
                    schoolName: joi.string().default('').when('isRegularSchool', 
                        { is: true , then: joi.string().regex(/([\w.\(\),']+\s?)+/).required()})
                }).required()
            }),
            putPatient: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId(),
                body: joi.object().keys({
                    name: joi.string(),
                    birthDay: joi.date().min(new Date(1900, 1, 1)),
                    isActive: joi.bool(),
                    isRegularSchool: joi.bool(),
                    schoolName: joi.string().default('').when('isRegularSchool', 
                        { is: true , then: joi.string().regex(/([\w.\(\),']+\s?)+/).required()})
                }).required()
            })
        };
    }
}
