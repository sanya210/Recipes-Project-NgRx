import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, exhaustMap, take, map } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {// allows us to just take 1 observable i.e. user and unsubscribe automatically
        //select gives us observable 
        return this.store.select('auth').pipe(take(1),
        map(authState => {
            return authState.user;
        }), 
        exhaustMap(user => {// took user obs and unsubscribed after use

            if (!user) {
                return next.handle(req); // initial user being null gives error even before req is sent so we do next
            }
            const modifiedReq = req.clone({params: new HttpParams().set('auth',user.token)})// passing query param to fetch data of currently signed in user
            return next.handle(modifiedReq);
        }))
    
    }

}