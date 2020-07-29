import joi from 'joi';
import BaseSchema from '../../base/base.schema';

export class RoleSchema extends BaseSchema {
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
                    length: joi.number().positive().default(10),
                    includeDeleted: joi.boolean().default(false)
                }).default({ start: 0, length: 10 }),
            }),
            postRole: this.generateSchema({
                headers: this.queryAuthSchema(),
                body: joi.object().keys({
                    name: joi.string().required()
                }).required()
            }),
            putRole: this.generateSchema({
                headers: this.queryAuthSchema(),
                params: this.paramsObjectId(),
                body: joi.object().keys({
                    name: joi.string(),
                    users: joi.array().items(
                        joi.object().keys({
                            id: joi.number().positive().required()
                        })
                    ).default([])
                }).required()
            })
        };
    }
}
