
export interface ITokenService {
    verify(token: string): Promise<string | object>;
    generate(payload: object): Promise<string>;
}
