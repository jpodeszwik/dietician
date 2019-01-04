import {Meal} from './meal';

export class Diet {
  meals: Meal[];

  constructor(meals: Meal[]) {
    this.meals = meals;
  }

  totalWeight(): number {
    return this.sumBy(meal => meal.totalWeight());
  }

  totalProteins(): number {
    return this.sumBy(meal => meal.totalProteins());
  }

  totalCarbohydrates(): number {
    return this.sumBy(meal => meal.totalCarbohydrates());
  }

  totalFats(): number {
    return this.sumBy(meal => meal.totalFats());
  }

  totalNutritionValue(): number {
    return this.sumBy(meal => meal.totalNutritionValue());
  }

  private sumBy(fn: (Meal) => number): number {
    return this.meals.map(i => fn(i)).reduce((prev, current) => current + prev, 0);
  }
}
