import { ITokenService } from "../../../src/authentication/itoken.service";

export class StubTokenService implements ITokenService {
    /* @ts-ignore */
    verify(token: string): Promise<string | object> {
        throw new Error("Method not implemented.");
    }
    /* @ts-ignore */
    generate(payload: object): Promise<string> {
        throw new Error("Method not implemented.");
    }
}