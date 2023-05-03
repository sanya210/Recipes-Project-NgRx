import { HttpClient } from "@angular/common/http";
import { Actions, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs/operators";
import * as AuthActions from './auth.actions';

export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean // optional parameter, login needs this signup doesn't
}


//Actions is obs that give access to all dispatched actions, allows to even dispatch more actions (like async)
export class AuthEffects {
    authLogin = this.actions$.pipe(ofType( AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAV5JJl59VwYNY0SOcEgW12hJ1sXqhaKn0',
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        })
    })
    );

    constructor(private actions$: Actions, private http: HttpClient){}
}