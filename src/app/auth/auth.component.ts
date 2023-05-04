import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'

})
export class AuthComponent implements OnInit{
    isLoginMode = true;
    isLoading = false;
    allRecipes: Recipe[];
    error:string=null;
    constructor(private authService:AuthService,
                private router: Router,
                private dsservice: DataStorageService,
                private recipeService: RecipeService,
                private store: Store<fromApp.AppState>){

    }
    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading; // updating UI based on correct state in our NgRx store
            this.error = authState.authError;
        });
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }
    onSubmit(form: NgForm){
        if(!form.valid){ // extra validation just in case the user hacks into calling this method without validated details using browser settings
            return;
        }
        this.isLoading = true;
        const email = form.value.email;
        const password = form.value.password;
      
        if(this.isLoginMode){
            //authObs = this.authService.login(email, password); 
            this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
        }
        else{
           this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password}));
        }   
        // this.dsservice.fetchRecipes()
        // .subscribe(
        //   (recipes)=>
        //     {
        //       this.allRecipes = recipes;
        //       this.recipeService.setRecipes(this.allRecipes);
        //     });
        form.reset();
    }

    onHandleError() {
        this.error = null;
      }

}