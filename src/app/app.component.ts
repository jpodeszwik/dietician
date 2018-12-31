import { Component } from '@angular/core';
import { Ingredient } from './model/ingredient'
import { IngredientsService } from './ingredients.service';
import { Diet } from './model/diet';
import { Meal } from './model/meal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dietician';
  ingredients: Ingredient[];
  is: IngredientsService;


  constructor(is: IngredientsService) {
    this.is = is;

  }

  ngOnInit() {
    this.is.getIngredients()
      .then(ingredients => this.ingredients = ingredients);

  }
}
