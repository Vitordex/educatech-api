import Koa from 'koa';
import config from 'config';
import bodyParser from 'koa-bodyparser';
import { ErrorHandleMiddleware } from '@xdgame-studio/koa-error-handle-middleware';
import { RouteLoggerMiddleware } from '@xdgame-studio/koa-route-logger-middleware';
import { AuthenticationMiddleware, TOKEN_LOCATION } from './authentication/authentication.middleware';
import { JwtService } from './authentication/jwt.service';
import { DBUserService } from "./auth/users/db-user.service";
import { HashingService } from "./auth/users/hashing.service";
import { UserController } from './auth/users/user.controller';
import { UserApi } from './auth/users/user.api';
import { UserSchema } from './auth/users/user.schema';
import { InputValidation } from './input-validation/input-validation.middleware';
import Logger from 'bunyan';
import { MySQLDatabaseService, ConnectionOptions } from './database/mysql-database.service';
import { DatabaseContext } from './database/database-context';
import { DBRoleService } from "./auth/roles/db-role.service";
import { RoleController } from './auth/roles/role.controller';
import { RoleApi } from './auth/roles/role.api';
import { RoleSchema } from './auth/roles/role.schema';
import BaseApi from './base/base.api';
import { DatabaseSeed } from './database/database-seed';
import { AuthorizationMiddleware } from './authorization/authorization.middleware';
import { DBUserActionService } from './auth/user-actions/db-user-action.service';
import { DBActionService } from './auth/actions/db-action.service';
import { DBPatientService } from './patients/db-patient.service';
import { PatientController } from './patients/patient.controller';
import { PatientSchema } from './patients/patient.schema';
import { PatientApi } from './patients/patient.api';
import { PermissionService } from './authorization/permission.service';
import { TherapySessionController } from './therapy-sessions/therapy-session.controller';
import { DBTherapySessionService } from './therapy-sessions/db-therapy-session.service';
import { TherapySessionSchema } from './therapy-sessions/therapy-session.schema';
import { TherapySessionApi } from './therapy-sessions/therapy-session.api';

const app = new Koa();

async function configureDatabase() {
    let dbOptions = config.get('db.connection') as ConnectionOptions;
    const database = new MySQLDatabaseService();
    await database.configure(dbOptions);

    const dbContext = new DatabaseContext();
    dbContext.configure(database);

    await database.sync({});
    await DatabaseSeed.execute();

    return dbContext;
}

export async function initApp(logger: Logger) {
    const dbContext = await configureDatabase();

    app.use(bodyParser());
    app.use(RouteLoggerMiddleware(logger));
    app.use(ErrorHandleMiddleware(logger));

    const jwtService = new JwtService('teste', 'Teste', '6h');
    const authenticationMiddleware = new AuthenticationMiddleware(jwtService, TOKEN_LOCATION.AUTH_HEADER);
    const authorizationMiddleware = new AuthorizationMiddleware(dbContext);
    const validationMiddleware: InputValidation = new InputValidation();

    const hashingOptions = config.get('hashing') as any;
    const hashingService = new HashingService(hashingOptions.saltRounds);

    const userService = new DBUserService(dbContext);
    const roleService = new DBRoleService(dbContext);
    const patientService = new DBPatientService(dbContext);
    
    const userActionService = new DBUserActionService(dbContext);
    const actionService = new DBActionService(dbContext);
    const permissionService = new PermissionService(userActionService, actionService);

    const userController = new UserController(
        userService,
        jwtService,
        hashingService,
        roleService,
        permissionService);
    const userSchema = new UserSchema(InputValidation.BaseSchema);
    const userApi = new UserApi(
        userController,
        userSchema,
        authenticationMiddleware,
        validationMiddleware,
        authorizationMiddleware);
    includeRoutes(userApi, app);

    const roleController = new RoleController(roleService, userService);
    const roleSchema = new RoleSchema(InputValidation.BaseSchema);
    const roleApi = new RoleApi(
        roleController, 
        roleSchema, 
        authenticationMiddleware,
        authorizationMiddleware, 
        validationMiddleware);
    includeRoutes(roleApi, app);

    const patientController = new PatientController(patientService, userService, permissionService);
    const patientSchema = new PatientSchema(InputValidation.BaseSchema);
    const patientApi = new PatientApi(
        patientController, 
        patientSchema, 
        authenticationMiddleware, 
        validationMiddleware, 
        authorizationMiddleware);
    includeRoutes(patientApi, app);

    const therapySessionService = new DBTherapySessionService(dbContext);
    const therapySessionController = new TherapySessionController(
        therapySessionService, 
        userService, 
        patientService, 
        permissionService);
    const therapySessionSchema = new TherapySessionSchema(InputValidation.BaseSchema);
    const therapySessionApi = new TherapySessionApi(
        therapySessionController, 
        therapySessionSchema, 
        authenticationMiddleware, 
        validationMiddleware, 
        authorizationMiddleware);
    includeRoutes(therapySessionApi, app);

    return app;
}

function includeRoutes(api: BaseApi, app: Koa) {
    api.configureRoutes();
    app.use(api.routes);
    app.use(api.allowedMethods);
}