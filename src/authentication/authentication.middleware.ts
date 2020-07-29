import { Middleware, Context } from "koa";
import { NextFunction } from "connect";
import { ITokenService } from "./itoken.service";
import { ApiFunctions } from "../api_utilities/api-functions";
import { API_STATUS } from "../api_utilities/api-status";

export enum TOKEN_LOCATION {
    AUTH_HEADER,
    QUERY
}

interface User {
    id: any
}

declare module 'koa' {
    interface Context {
        state: {
            user: User
        }
    }
}

export class AuthenticationMiddleware {
    constructor(private tokenService: ITokenService,
        private tokenLocation = TOKEN_LOCATION.QUERY,
        private tokenPropertyName = 'token') {
        if (tokenLocation !== TOKEN_LOCATION.QUERY && tokenLocation !== TOKEN_LOCATION.AUTH_HEADER)
            throw new TypeError('Invalid token extraction method');

        this.tokenLocation = tokenLocation || this.tokenLocation;
        if (this.tokenLocation !== TOKEN_LOCATION.AUTH_HEADER)
            this.tokenPropertyName = tokenPropertyName || this.tokenPropertyName;
        else
            this.tokenPropertyName = "authorization"
    }

    private middleware: Middleware = async (context: Context, next: NextFunction) => {
        const input = context.input || { query: {}, headers: {} };
        if (!input.query && !input.headers) ApiFunctions.throwError(API_STATUS.BAD_REQUEST, 'Please provide an auth token');

        let token: string;
        switch (this.tokenLocation) {
            case TOKEN_LOCATION.QUERY:
                token = input.query![this.tokenPropertyName];
                break;
            case TOKEN_LOCATION.AUTH_HEADER:
                token = input.headers![this.tokenPropertyName].split(' ')[1];
                break;
        }

        let payload;
        try {
            payload = await this.tokenService.verify(token);
        } catch (error) {
            const status = 401;
            const message = 'Invalid token';
            context.throw(message, status, error);
        }

        context.state.user = payload;
        return next();
    };

    /**
     * Authenticates a request for a user
     */
    public authenticate(): Middleware {
        return this.middleware;
    }
}