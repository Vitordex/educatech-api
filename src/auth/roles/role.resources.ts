export interface IRegisterInput {
    email: string,
    password: string,
    name: string
}

export interface IPutRoleInput {
    email?: string,
    password?: string,
    name?: string
}