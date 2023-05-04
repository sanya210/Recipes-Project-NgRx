import { HttpClient } from "@angular/common/http";
import { Actions, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import * as AuthActions from './auth.actions';
import { of } from "rxjs";
import { Injectable } from "@angular/core";

export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean // optional parameter, login needs this signup doesn't
}


//Actions is obs that give access to all dispatched actions, allows to even dispatch more actions (like async)
// NgRx effects will automatically dispatch action 
@Injectable()
export class AuthEffects {
    authLogin = this.actions$.pipe(ofType( AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAV5JJl59VwYNY0SOcEgW12hJ1sXqhaKn0',
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }
        ).pipe(
            map(resData => {
                const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
                return of(new AuthActions.Login({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate}));
            },
            catchError(error => {
            // return non-error obsv so overall stream doesn't die
           return of();
        }) 
        ));
    })
    );

    constructor(private actions$: Actions, private http: HttpClient){}
}