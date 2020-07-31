import { AuthenticationMiddleware } from "../authentication/authentication.middleware";
import { InputValidation } from "../input-validation/input-validation.middleware";
import { PatientSchema } from "./patient.schema";
import { PatientController } from "./patient.controller";
import BaseApi from "../base/base.api";
import { AuthorizationMiddleware } from "../authorization/authorization.middleware";

export class PatientApi extends BaseApi {
    constructor(protected controller: PatientController,
        private patientSchema: PatientSchema,
        private authMiddleware: AuthenticationMiddleware,
        private validationMiddleware: InputValidation,
        private authorizationMiddleware: AuthorizationMiddleware) {
        super('patients', 'patients');
    }

    public configureRoutes() {
        this.router.get(
            '/v1/user/:userId',
            this.validationMiddleware.validate(this.patientSchema.schemas.listForUser),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.userId', this.getOperation('listPatientsForUser')),
            this.executionMiddleware(
                ({ query: { start, length }, params: { userId } }) => 
                    this.controller.listPatientsForUser(userId, start, length))
        );

        this.router.get(
            '/v1/:id',
            this.validationMiddleware.validate(this.patientSchema.schemas.getById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('getById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.getById(id))
        );

        this.router.get(
            '/v1/',
            this.validationMiddleware.validate(this.patientSchema.schemas.list),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('listPatients')),
            this.executionMiddleware(({ query: { start, length } }) => this.controller.listPatients(start, length))
        );

        this.router.delete(
            '/v1/:id',
            this.validationMiddleware.validate(this.patientSchema.schemas.deleteById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('deleteById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.deleteById(id)),
        );

        this.router.post(
            '/v1/',
            this.validationMiddleware.validate(this.patientSchema.schemas.postPatient),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('postPatient')),
            this.executionMiddleware(({ body: patient }, userId) => this.controller.postPatient(patient, userId)),
        );

        this.router.put(
            '/v1/:id',
            this.validationMiddleware.validate(this.patientSchema.schemas.putPatient),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('putPatient')),
            this.executionMiddleware(({ body: patientInput, params: { id } }) => this.controller.putPatient(id, patientInput))
        );
    }
}