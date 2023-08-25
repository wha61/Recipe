import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 添加此行

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeAppComponent } from './recipe-app/recipe-app.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { SavedRecipeComponent } from './saved-recipe/saved-recipe.component';
import { HttpClientModule } from '@angular/common/http';
import { RecipeService } from './recipe.service';

@NgModule({
  declarations: [
    AppComponent,
    RecipeAppComponent,
    RecipeFormComponent,
    RecipeListComponent,
    SavedRecipeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // 添加此行
    NgbModalModule,
    HttpClientModule
  ],
  providers: [RecipeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
