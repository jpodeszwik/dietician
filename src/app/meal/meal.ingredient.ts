import { Ingredient } from '../ingredient';

export class MealIngredient {
  ingredient: Ingredient;
  weight: number;

  constructor(ingredient: Ingredient, weight: number) {
    this.ingredient = ingredient;
    this.weight = weight;
  }

  proteins(): number {
    return this.ingredient.proteins * this.weight / 100;
  }

  carbohydrates(): number {
    return this.ingredient.carbohydrates * this.weight / 100;
  }

  fats(): number {
    return this.ingredient.fats * this.weight / 100;
  }

  nutritionValue(): number {
    return this.ingredient.nutritionValue * this.weight / 100;
  }
}