import joi from 'joi';
import BaseSchema from '../../base/base.schema';

export class UserSchema extends BaseSchema {
    public get schemas() {
        return {
            register: this.generateSchema({
                body: joi.object().keys({
                    name: joi.string().required(),
                    email: joi.string().email().required(),
                    password: joi.string().required(),
                    gender: joi.number().min(0).max(2).required(),
                    birthDay: joi.date().min(new Date(1900, 1, 1)).required()
                }).required()
            }),
            login: this.generateSchema({
                body: joi.object().keys({
                    email: joi.string().email().required(),
                    password: joi.string().required()
                }).required()
            }),
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
                }).default({start: 0, length: 10}),
            }),
            postUser: this.generateSchema({
                headers: this.queryAuthSchema(),
                body: joi.object().keys({
                    name: joi.string().required(),
                    email: joi.string().email().required(),
                    password: joi.string().required(),
                    roleId: joi.number().default(2),
                    gender: joi.number().min(0).max(2).required(),
                    birthDay: joi.date().min(new Date(1900, 1, 1)).required()
                }).required()
            }),
            putUser: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId(),
                body: joi.object().keys({
                    name: joi.string(),
                    email: joi.string().email(),
                    password: joi.string(),
                    roleId: joi.number(),
                    gender: joi.number().min(0).max(2),
                    birthDay: joi.date().min(new Date(1900, 1, 1))
                }).required()
            })
        };
    }
}
