import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-saved-recipe',
  templateUrl: './saved-recipe.component.html',
  styleUrls: ['./saved-recipe.component.css']
})
export class SavedRecipeComponent implements OnInit {
  recipe: any;
  ingredient: any;
  savedRecipes: any[] = [];
  recipeId: number = 0;
  editMode = false; // to show edit part or not

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.recipeId = +params['id'];
      console.log("recipeId:" + this.recipeId)
      this.getRecipeById(this.recipeId);
    });
  }

  getRecipeById(recipeId: number) {
    this.recipeService.getRecipe(recipeId).subscribe(
        (recipe: any[]) => {
            // this.savedRecipes = recipes;
            // this.recipe = this.savedRecipes.find(recipe => recipe.id === recipeId);
            this.recipe = recipe[0]
            console.log(this.recipe)
            if(this.recipe !== null){
              this.recipeService.getIngredient(recipeId).subscribe(
                (ingredient: any[]) => {
                    this.ingredient = ingredient;
                },
                (error: any) => {
                    console.error('There was an error!', error);
                }
            );
            }
        },
        (error: any) => {
            console.error('There was an error!', error);
        }
    );
  }

  onSubmit(form: any) {
    // Get timestamp
    const date = new Date();
    // Gets the year, month, date, hour, minute, and second
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1); // months are 0-based in JavaScript
    const day = this.pad(date.getDate());
    let hour = date.getHours();
    const minute = this.pad(date.getMinutes());
    const second = this.pad(date.getSeconds());
    // Determine whether it is morning or afternoon and convert it to AM/PM format
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert the hours to a 12-hour system
    // save as string
    const formattedDateTime = `${year}-${month}-${day}  ${this.pad(hour)}:${minute}:${second} ${ampm}`;
    
    let time = formattedDateTime;

    console.log(time)
    console.log(form.value)
    this.recipeService.updateRecipe(this.recipeId, form.value, time).subscribe(
      () => {
        this.editMode = false;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate([`/recipe/${this.recipeId}`]));
      },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );
  }

  pad(n: number) {
    return n < 10 ? '0' + n : n.toString();
  }

  close(){
    window.close();
    this.location.back();
  }

  edit(){
    this.editMode = true;
  }
  
  delete() {
    if (this.recipe !== null && this.recipe.id !== null) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe(
        () => {
          this.location.back(); 
        },
        (error: any) => {
          console.error('There was an error deleting the recipe!', error);
        }
      );
    }
  }
}
