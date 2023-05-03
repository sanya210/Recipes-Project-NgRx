import { Component, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private subscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState> // type of Store is a js object that has rn shoppingList as key and type of this is what the reducer function yields which is an object having ingredients key and list of ingredients as value
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');//returns an observable, angular does our subscribing and unsubscribing
    // this.ingredients = this.shoppingListService.getIngredirents();
    // this.subscription = this.shoppingListService.ingredientChanged
    //   .subscribe(
    //     (ingredients: Ingredient[])=>{
    //       this.ingredients = ingredients;
    //     }
    //   )
  }
  onEditItem(index:number){
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
  }
}
