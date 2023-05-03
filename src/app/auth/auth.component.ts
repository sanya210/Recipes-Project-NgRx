import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'

})
export class AuthComponent{
    isLoginMode = true;
    isLoading = false;
    allRecipes: Recipe[];
    error:string=null;
    constructor(private authService:AuthService,
                private router: Router,
                private dsservice: DataStorageService,
                private recipeService: RecipeService){

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
        let authObs: Observable<AuthResponseData>;
        if(this.isLoginMode){
            authObs = this.authService.login(email, password); //accessing login method of authService component and subscribing to it later
        }
        else{
            authObs = this.authService.signup(email, password);// accessing signup mehod of authService component 
        }
        authObs.subscribe(
            resData=>{
                console.log(resData);
                this.isLoading=false;
                this.router.navigate(['/recipes']);
            },errorRes=>{
                console.log(errorRes);
                this.error = errorRes; // subscribing to error message from authService class
                this.isLoading=false;
            });
        this.dsservice.fetchRecipes() //subscribing to observable/event emitted by data storage service and storing recipes array here in allRecipes array
        .subscribe(
          (recipes)=>
            {
              this.allRecipes = recipes;
              this.recipeService.setRecipes(this.allRecipes); // calling setRecipes method of recipeService and passing this allRecipes array as parameter
            });
        form.reset();
    }

    onHandleError() {
        this.error = null;
      }

}