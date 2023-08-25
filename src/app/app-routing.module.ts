import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { SavedRecipeComponent } from './saved-recipe/saved-recipe.component';
import { RecipeAppComponent } from './recipe-app/recipe-app.component';

const routes: Routes = [
  { path: '', component: RecipeAppComponent },
  { path: 'list', component: RecipeListComponent },
  { path: 'add', component: RecipeFormComponent },
  { path: 'recipe/:id', component: SavedRecipeComponent },
];

// routes into main module
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


