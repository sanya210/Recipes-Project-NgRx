import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  allRecipes: Recipe[];
  isAuthenticated = false;
  private userSub: Subscription;
  constructor(private dataStorageService: DataStorageService,
              private recipeService: RecipeService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(
      map(authState => {
        return authState.user;
      })
    ).subscribe(
      user=>{
        this.isAuthenticated = !user?false:true;
      }
    );
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }
  onFetchData(){
    this.dataStorageService.fetchRecipes() //subscribing to observable/event emitted by data storage service and storing recipes array here in allRecipes array
      .subscribe(
        (recipes)=>
          {
            this.allRecipes = recipes;
            this.recipeService.setRecipes(this.allRecipes); // calling setRecipes method of recipeService and passing this allRecipes array as parameter
          });
  }

  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
