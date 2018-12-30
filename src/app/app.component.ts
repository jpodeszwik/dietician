import { Component } from '@angular/core';
import { Ingredient } from './ingredient'
import { IngredientsService } from './ingredients.service';
import { Meal } from './meal/meal';
import { MealIngredient } from './meal/meal.ingredient';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dietician';
  ingredients: Ingredient[];
  is: IngredientsService;
  meals: Meal[];

  constructor(is: IngredientsService) {
    this.is = is;
    this.meals = [
      new Meal("Meal 1", [
        new MealIngredient(new Ingredient('0', 'Milk', 10, 5, 5, 100), 100),
        new MealIngredient(new Ingredient('1', 'Butter', 10, 5, 5, 100), 200),
      ]),
      new Meal("Meal 2", [
        new MealIngredient(new Ingredient('2', 'Chicken', 10, 5, 5, 100), 150),
        new MealIngredient(new Ingredient('3', 'Butter', 10, 5, 5, 100), 200),
      ]),
      new Meal("Meal 3", [
      ])
    ];
  }

  ngOnInit() {
    this.is.getIngredients()
      .then(ingredients => this.ingredients = ingredients);

  }
}
