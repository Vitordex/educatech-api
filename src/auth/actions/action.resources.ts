export interface IRegisterInput {
    email: string,
    password: string,
    name: string
}

export interface IPutActionInput {
    email?: string,
    password?: string,
    name?: string
}