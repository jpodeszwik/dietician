import {MealIngredient} from './meal.ingredient';

export class Meal {
  name: string;
  ingredients: MealIngredient[];

  constructor(name: string, ingredients: MealIngredient[]) {
    this.name = name;
    this.ingredients = ingredients;
  }

  totalProteins(): number {
    return this.sumBy(i => i.proteins() || 0);
  }

  totalCarbohydrates(): number {
    return this.sumBy(i => i.carbohydrates() || 0);
  }

  totalFats(): number {
    return this.sumBy(i => i.fats() || 0);
  }

  totalNutritionValue(): number {
    return this.sumBy(i => i.nutritionValue() || 0);
  }

  totalWeight(): number {
    return this.sumBy(i => i.weight);
  }

  private sumBy(fn: (MealIngredient) => number): number {
    return this.ingredients.map(i => fn(i)).reduce((prev, current) => current + prev, 0);
  }
}
