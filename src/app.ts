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

    const userActionService = new DBUserActionService(dbContext);
    const actionService = new DBActionService(dbContext);
    const userController = new UserController(
        userService,
        jwtService,
        hashingService,
        roleService,
        userActionService,
        actionService);
    const userSchema = new UserSchema(InputValidation.BaseSchema);
    const userApi = new UserApi(
        userController,
        userSchema,
        authenticationMiddleware,
        validationMiddleware,
        authorizationMiddleware);
    userApi.configureRoutes();
    includeRoutes(userApi, app);

    const roleController = new RoleController(roleService, userService);
    const roleSchema = new RoleSchema(InputValidation.BaseSchema);
    const roleApi = new RoleApi(
        roleController, 
        roleSchema, 
        authenticationMiddleware,
        authorizationMiddleware, 
        validationMiddleware);
    roleApi.configureRoutes();
    includeRoutes(roleApi, app);

    return app;
}

function includeRoutes(api: BaseApi, app: Koa) {
    app.use(api.routes);
    app.use(api.allowedMethods);
}