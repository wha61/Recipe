import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  // get all recipes
  getRecipes(): Observable<any> {
    return this.http.get('http://localhost:3001/list');
  }
  // get recipe by id
  getRecipe(id : number): Observable<any> {
    return this.http.get(`http://localhost:3001/list/${id}`);
  }
  // get ingredient by id
  getIngredient(id : number): Observable<any> {
    return this.http.get(`http://localhost:3001/listIngredients/${id}`);
  }
  // delete recipe and corresponding ingredient
  deleteRecipe(id : number): Observable<any> {
    return this.http.delete(`http://localhost:3001/list/${id}`);
  }
  // edit recipe
  updateRecipe(id: number, recipe: any, time: string): Observable<any> {
    const body = {
      ...recipe, 
      time // assuming 'time' is a property of your recipe
    };
    return this.http.put(`http://localhost:3001/edit/${id}`, body);
  }

}
