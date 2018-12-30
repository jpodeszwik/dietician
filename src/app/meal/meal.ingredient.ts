import { Ingredient } from '../ingredient';

export class MealIngredient {
  ingredient: Ingredient;
  weight: number;

  constructor(ingredient: Ingredient, weight: number) {
    this.ingredient = ingredient;
    this.weight = weight;
  }
}