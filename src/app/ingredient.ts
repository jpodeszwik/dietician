export class Ingredient {
  id: string;
  name: string;
  proteins: number;
  carbohydrates: number;
  fats: number;
  nutritionValue: number;

  constructor(id: string, name: string, proteins: number, carbohydrates: number, fats: number, nutritionValue: number) {
    this.id = id;
    this.name = name;
    this.proteins = proteins;
    this.carbohydrates = carbohydrates;
    this.fats = fats;
    this.nutritionValue = nutritionValue;
  }
}