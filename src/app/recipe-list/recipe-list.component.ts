
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  savedRecipes: any[] = [];
  
  constructor(private router: Router,private location: Location,  private recipeService: RecipeService) { }

  ngOnInit() {
    this.showRecipes()
  }

  showRecipes(){
    this.recipeService.getRecipes().subscribe(
      (recipes: any[]) => {
        this.savedRecipes = recipes;
        console.log("saved recipes are: ")
        console.log(this.savedRecipes)
      },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );
  }

  showDetailedRecipe(recipe: any) {
    // console.log(recipe.id)
    this.router.navigate(['/recipe', recipe.id]);
  }

  close(){
    this.router.navigate(['/']);
  }
}
