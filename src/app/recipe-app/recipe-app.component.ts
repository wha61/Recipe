import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-app',
  templateUrl: './recipe-app.component.html',
  styleUrls: ['./recipe-app.component.css']
})
export class RecipeAppComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { } // 注入 HttpClient

  // when initiated, try create two table
  ngOnInit() {
    this.loadData()
  }

  // this is create table method
  loadData() {
    this.http.post('http://localhost:3001/', {}, {responseType: 'text'}).subscribe(
      (response) => {
        console.log('Response from the server:', response);
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  // when user click "clear data" button, drop table and recreate table
  clearAll() {
  if(confirm("Are you sure you want to delete all recipes?")) {
    this.http.delete('http://localhost:3001/deleteAll', {responseType: 'text'}).subscribe(
      (response) => {
        alert('All recipes deleted');
        console.log('Response from the server:', response);
        this.loadData()
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  } else {
    console.log("User decided not to delete all recipes");
  }
  }
  
}
