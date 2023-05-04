import { Component,OnInit} from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(private recipeService: RecipeService,
              private router:Router,
              private route: ActivatedRoute,
              private dsservice: DataStorageService) { 
  }
// subscribing to event emitted by setRecipes method of recipe service class 
  ngOnInit() {
    this.recipeService.recipesChanged
      .subscribe(
        (recipes: Recipe[])=>{
          this.recipes = recipes;
        }
      );
    // this.recipes = this.recipeService.getRecipes();
    // to fetch recipe automatically during every CDC
    this.dsservice.fetchRecipes().subscribe(
      (recipes)=>
        {
          this.recipes = recipes;
          this.recipeService.setRecipes(this.recipes); 
        });
  }
  // onRecipeSelected(recipe: Recipe){
  //   this.recipeWasSelected.emit(recipe);
  // }
  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo: this.route});
  }

}
