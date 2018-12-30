import { Ingredient } from '../ingredient';

export class MealIngredient {
  ingredient: Ingredient;
  weight: number;

  constructor(ingredient: Ingredient, weight: number) {
    this.ingredient = ingredient;
    this.weight = weight;
  }

  proteins(): number {
    return this.ingredient ? this.calculateWeighted(this.ingredient.proteins) : 0;
  }

  carbohydrates(): number {
    return this.ingredient ? this.calculateWeighted(this.ingredient.carbohydrates) : 0;
  }

  fats(): number {
    return this.ingredient ? this.calculateWeighted(this.ingredient.fats) : 0;
  }

  nutritionValue(): number {
    return this.ingredient ? this.calculateWeighted(this.ingredient.nutritionValue) : 0;
  }

  private calculateWeighted(val: number) {
    const value = val;
    return value * this.weight / 100;
  }
}