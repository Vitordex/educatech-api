import { HashingService } from "../auth/users/hashing.service";
import { Action } from "../auth/actions/action";
import { Role } from "../auth/roles/role";
import { User } from "../auth/users/user";
import { IRoleAction, RoleAction } from "../auth/role-actions/role-action";

export class DatabaseSeed {
    public static async execute(): Promise<void> {
        const now = new Date(Date.now());
        const actions = await Action.bulkCreate([
            {
                id: 1,
                serviceName: 'roles',
                methodName: 'getById',
                created_at: now,
                updated_at: now
            },
            {
                id: 2,
                serviceName: 'roles',
                methodName: 'deleteById',
                created_at: now,
                updated_at: now
            },
            {
                id: 3,
                serviceName: 'roles',
                methodName: 'postRole',
                created_at: now,
                updated_at: now
            },
            {
                id: 4,
                serviceName: 'roles',
                methodName: 'putRole',
                created_at: now,
                updated_at: now
            },
            {
                id: 5,
                serviceName: 'roles',
                methodName: 'listRoles',
                created_at: now,
                updated_at: now
            },
            {
                id: 6,
                serviceName: 'users',
                methodName: 'getById',
                created_at: now,
                updated_at: now
            },
            {
                id: 7,
                serviceName: 'users',
                methodName: 'deleteById',
                created_at: now,
                updated_at: now
            },
            {
                id: 8,
                serviceName: 'users',
                methodName: 'postUser',
                created_at: now,
                updated_at: now
            },
            {
                id: 9,
                serviceName: 'users',
                methodName: 'putUser',
                created_at: now,
                updated_at: now
            },
            {
                id: 10,
                serviceName: 'users',
                methodName: 'listUsers',
                created_at: now,
                updated_at: now
            },
            {
                id: 11,
                serviceName: 'patients',
                methodName: 'getById',
                created_at: now,
                updated_at: now
            },
            {
                id: 12,
                serviceName: 'patients',
                methodName: 'deleteById',
                created_at: now,
                updated_at: now
            },
            {
                id: 13,
                serviceName: 'patients',
                methodName: 'postPatient',
                created_at: now,
                updated_at: now
            },
            {
                id: 14,
                serviceName: 'patients',
                methodName: 'putPatient',
                created_at: now,
                updated_at: now
            },
            {
                id: 15,
                serviceName: 'patients',
                methodName: 'listPatients',
                created_at: now,
                updated_at: now
            },
            {
                id: 16,
                serviceName: 'patients',
                methodName: 'listPatientsForUser',
                created_at: now,
                updated_at: now
            },
            {
                id: 17,
                serviceName: 'therapy-sessions',
                methodName: 'getById',
                created_at: now,
                updated_at: now
            },
            {
                id: 18,
                serviceName: 'therapy-sessions',
                methodName: 'deleteById',
                created_at: now,
                updated_at: now
            },
            {
                id: 19,
                serviceName: 'therapy-sessions',
                methodName: 'postTherapySession',
                created_at: now,
                updated_at: now
            },
            {
                id: 20,
                serviceName: 'therapy-sessions',
                methodName: 'putTherapySession',
                created_at: now,
                updated_at: now
            },
            {
                id: 21,
                serviceName: 'therapy-sessions',
                methodName: 'listTherapySessions',
                created_at: now,
                updated_at: now
            },
            {
                id: 22,
                serviceName: 'therapy-sessions',
                methodName: 'listTherapySessionsForUser',
                created_at: now,
                updated_at: now
            }
        ], { updateOnDuplicate: ["methodName", "serviceName"] });

        const roles = await Role.bulkCreate([
            {
                id: 1,
                name: 'Admin',
                created_at: now,
                updated_at: now
            }, {
                id: 2,
                name: 'Professional',
                created_at: now,
                updated_at: now
            }
        ], { updateOnDuplicate: ["id"] });

        let count = 1;
        const adminRole = roles[0];
        const adminRoleActionsRaw = actions.map((action) => ({
            id: count++,
            roleId: adminRole.id,
            actionId: action.id,
            created_at: now,
            updated_at: now,
            resourceRange: '*'
        } as IRoleAction));
        await RoleAction.bulkCreate(adminRoleActionsRaw,
            { updateOnDuplicate: ["id"] });

        const professionalRole = roles[1];
        const professionalRoleActionsRaw: IRoleAction[] = [{
            id: count++,
            actionId: 13,
            resourceRange: '*',
            roleId: professionalRole.id,
            created_at: now,
            updated_at: now
        }, {
            id: count++,
            actionId: 19,
            resourceRange: '*',
            roleId: professionalRole.id,
            created_at: now,
            updated_at: now
        }];
        await RoleAction.bulkCreate(professionalRoleActionsRaw,
            { updateOnDuplicate: ["id"] });

        const hashService = new HashingService();
        await User.bulkCreate([
            {
                id: 1,
                name: 'Vitor Ribeiro',
                email: 'vitordex@hotmail.com',
                password: await hashService.createHash('senha muito forte'),
                roleId: roles.filter((role) => role.name === 'Admin')[0].id,
                gender: 1,
                birthDay: new Date(1995, 5, 12),
                createdAt: now,
                updatedAt: now
            }
        ], { updateOnDuplicate: ["email"] });
    }
}