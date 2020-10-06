import { AuthenticationMiddleware } from "../authentication/authentication.middleware";
import { InputValidation } from "../input-validation/input-validation.middleware";
import { TherapySessionSchema } from "./therapy-session.schema";
import { TherapySessionController } from "./therapy-session.controller";
import BaseApi from "../base/base.api";
import { AuthorizationMiddleware } from "../authorization/authorization.middleware";

export class TherapySessionApi extends BaseApi {
    constructor(protected controller: TherapySessionController,
        private therapySessionSchema: TherapySessionSchema,
        private authMiddleware: AuthenticationMiddleware,
        private validationMiddleware: InputValidation,
        private authorizationMiddleware: AuthorizationMiddleware) {
        super('therapy-sessions', 'therapy-sessions');
    }

    public configureRoutes() {
        this.router.get(
            '/v1/user/:userId',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.listForUser),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.userId', this.getOperation('listTherapySessionsForUser')),
            this.executionMiddleware(
                ({ query: { start, length }, params: { userId } }) => 
                    this.controller.listTherapySessionsForUser(userId, start, length))
        );

        this.router.get(
            '/v1/:id',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.getById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('getById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.getById(id))
        );

        this.router.get(
            '/v1/',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.list),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('listTherapySessions')),
            this.executionMiddleware(({ query: { start, length } }) => this.controller.listTherapySessions(start, length))
        );

        this.router.delete(
            '/v1/:id',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.deleteById),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('deleteById')),
            this.executionMiddleware(({ params: { id } }) => this.controller.deleteById(id)),
        );

        this.router.post(
            '/v1/',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.postTherapySession),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('', this.getOperation('postTherapySession')),
            this.executionMiddleware(({ body: therapySession }, userId) => this.controller.postTherapySession(therapySession, userId)),
        );

        this.router.put(
            '/v1/:id',
            this.validationMiddleware.validate(this.therapySessionSchema.schemas.putTherapySession),
            this.authMiddleware.authenticate(),
            this.authorizationMiddleware.authorize('params.id', this.getOperation('putTherapySession')),
            this.executionMiddleware(({ body: therapySessionInput, params: { id } }) => this.controller.putTherapySession(id, therapySessionInput))
        );
    }
}
