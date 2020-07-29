import joi from 'joi';
import BaseSchema from '../../base/base.schema';

export class ActionSchema extends BaseSchema {
    public get schemas() {
        return {
            getById: this.generateSchema({
                query: this.queryAuthSchema(),
                params: this.paramsObjectId()
            }),
            deleteById: this.generateSchema({
                query: this.queryAuthSchema(),
                params: this.paramsObjectId()
            }),
            list: this.generateSchema({
                query: this.queryAuthSchema({
                    start: joi.number().min(0).default(0),
                    length: joi.number().positive().default(10)
                }),
            }),
            postAction: this.generateSchema({
                query: this.queryAuthSchema(),
                body: joi.object().keys({
                    name: joi.string().required(),
                    email: joi.string().email().required(),
                    password: joi.string().required()
                }).required()
            }),
            putAction: this.generateSchema({
                query: this.queryAuthSchema(),
                params: this.paramsObjectId(),
                body: joi.object().keys({
                    name: joi.string(),
                    email: joi.string().email(),
                    password: joi.string()
                }).min(1).required()
            })
        };
    }
}
