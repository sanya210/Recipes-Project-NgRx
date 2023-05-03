import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
    readonly type = LOGIN;

    // we're passing all properties requires to create a user in payload. We could also make user and then pass that user object as payload
    constructor(
        public payload: {
            email: string,
            userId: string,
            token: string,
            expirationDate: Date;
        }
    ){}
}

export class Logout implements Action{
    readonly type = LOGOUT;
}

export class LoginStart implements Action{
    readonly type = LOGIN_START;

    constructor(public payload: { email: string; password: string}){}
}

export type AuthActionsUnion = Login | Logout;