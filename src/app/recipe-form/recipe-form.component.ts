import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 添加此行
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  // for saved recipes and last recipe id
  savedRecipes: any[] = [];
  index: number = 0;

  ngOnInit() {
    this.getRecipes()
  }

  recipe = {
    id: 0,
    savedTime: '',
    name: '',
    ingredients: '',
    directions: ''
  };

  getRecipes(){
      // get saved recipes from the server
      this.http.get<any[]>('http://localhost:3001/list').subscribe(
       (recipes) => {
         console.log("Received saved recipes: ", recipes); 
         this.savedRecipes = recipes;
         let length = this.savedRecipes.length;
         console.log("currently " + length + " recipes")
         if(length !== 0){
           this.index =  this.savedRecipes[length-1].id
           console.log("the last recipe id is: " + this.index)
         }
         else{
           this.index = -1
         }
       },
       (error) => {
         console.error('Error:', error);
       }
     );
  }

  resetForm() {
    this.recipe = {
      id: 0,
      savedTime: '',
      name: '',
      ingredients: '',
      directions: ''
    };
    console.log("form reset")
  }

  // send from front end back end, send recipe
  saveRecipeToDb() {
    this.http.post('http://localhost:3001/add', this.recipe).subscribe(data => {
      console.log('Response from the server:', data);
      console.log(this.recipe);
    }, error => {
      console.error('There was an error!', error);
    });
  }

  saveRecipe() {
    // get timestamp
    const timestamp = Date.now();
    // Create a Date object
    const date = new Date(timestamp);
    // Gets the year, month, date, hour, minute, and second
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    let  hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    // Determine whether it is morning or afternoon and convert it to AM/PM format
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert the hours to a 12-hour system
    // save as string
    const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second} ${ampm}`;
    this.recipe.savedTime = formattedDateTime;

    this.recipe.id = this.index + 1;

    // check none empty
    if (this.recipe.name.trim() === '') {
      alert('Please enter the name of your recipe.');
      return;
    }
    if (this.recipe.ingredients.trim() === '') {
      alert('Please enter the ingredients of your recipe.');
      return;
    }
    if (this.recipe.directions.trim() === '') {
      alert('Please enter the directions of your recipe.');
      return;
    }

    // once click saved, go back to main page.
    this.router.navigate(['..'], { relativeTo: this.route });
    
    // send to database
    this.saveRecipeToDb();
  }
}
