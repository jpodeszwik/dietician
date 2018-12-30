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
  diet: Diet;

  constructor(is: IngredientsService) {
    this.is = is;
    this.diet = new Diet([]);
  }

  removeMeal(index: number) {
    this.diet.meals.splice(index, 1);
  }

  addMeal() {
    this.diet.meals.push(new Meal(`Meal ${this.diet.meals.length + 1}`, []));
  }

  ngOnInit() {
    this.is.getIngredients()
      .then(ingredients => this.ingredients = ingredients);

  }
}
