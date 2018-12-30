import { MealIngredient } from './meal.ingredient';

export class Meal {
  name: string
  ingredients: MealIngredient[];

  constructor(name: string, ingredients: MealIngredient[]) {
    this.name = name;
    this.ingredients = ingredients;
  }

  totalProteins(): number {
    return this.sumBy(i => i.proteins());
  }

  totalCarbohydrates(): number {
    return this.sumBy(i => i.carbohydrates());
  }

  totalFats(): number {
    return this.sumBy(i => i.fats());
  }

  totalNutritionValue(): number {
    return this.sumBy(i => i.nutritionValue());
  }

  totalWeight(): number {
    return this.sumBy(i => i.weight);
  }

  private sumBy(fn: (MealIngredient) => number): number {
    return this.ingredients.map(i => fn(i)).reduce((prev, current) => current + prev, 0);
  }
}