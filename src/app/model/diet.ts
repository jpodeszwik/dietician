import { Meal } from './meal';

export class Diet {
  meals: Meal[];

  constructor(meals: Meal[]) {
    this.meals = meals;
  }

  proteins(): number {
    return this.sumBy(meal => meal.totalProteins());
  }

  carbohydrates(): number {
    return this.sumBy(meal => meal.totalCarbohydrates());
  }

  fats(): number {
    return this.sumBy(meal => meal.totalFats());
  }

  nutritionValue(): number {
    return this.sumBy(meal => meal.totalNutritionValue());
  }

  private sumBy(fn: (Meal) => number): number {
    return this.meals.map(i => fn(i)).reduce((prev, current) => current + prev, 0);
  }
}
