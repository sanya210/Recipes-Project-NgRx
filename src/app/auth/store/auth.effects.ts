import { HttpClient } from "@angular/common/http";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from './auth.actions';
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

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
    constructor(private actions$: Actions, private http: HttpClient, private router: Router){}

    authLogin = 
   createEffect(() => this.actions$.pipe(ofType( AuthActions.LOGIN_START),
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
               return new AuthActions.Login({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate});
           }),
           catchError(errorRes => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorRes.error || !errorRes.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
            }
            switch (errorRes.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
            }
            return of(new AuthActions.LoginFail(errorMessage));
          }) 
       )})
   ),{dispatch:true});

   authSuccess = createEffect(()=>this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  ),{dispatch: false});
   }
    