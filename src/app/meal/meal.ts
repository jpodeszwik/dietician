import { MealIngredient } from './meal.ingredient';

export class Meal {
  name: string
  ingredients: MealIngredient[];

  constructor(name: string, ingredients: MealIngredient[]) {
    this.name = name;
    this.ingredients = ingredients;
  }
}