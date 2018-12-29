import { Component } from '@angular/core';
import { Ingredient } from './ingredient'
import { IngredientsService } from './ingredients.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dietician';
  columnsToDisplay = ['name', 'proteins', 'carbohydrates', 'fats', 'nutritionValue'];
  ingredients: Ingredient[];
  is: IngredientsService

  constructor(is: IngredientsService) {
    this.is = is;
  }

  ngOnInit() {
    this.is.getIngredients()
      .then(ingredients => this.ingredients = ingredients);
  }
}
