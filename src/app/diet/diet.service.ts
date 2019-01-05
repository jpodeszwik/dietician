import {Injectable} from '@angular/core';
import {Diet} from '../model/diet';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AuthService} from '../services/auth.service';
import {Ingredient} from '../model/ingredient';
import {Meal} from '../model/meal';
import {MealIngredient} from '../model/meal.ingredient';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  constructor(private db: AngularFirestore, private auth: AuthService) {
  }

  saveDiet(diet: Diet) {
    const uid = this.auth.getUid();
    const path = `/users/${uid}/diets`;

    const dietObject = JSON.parse(JSON.stringify(diet));
    return this.db.collection(path).add(dietObject)
      .then(doc => doc.id);
  }

  getDiet(dietId: string): Promise<Diet> {
    const uid = this.auth.getUid();
    const path = `/users/${uid}/diets`;

    return this.db.collection(path).doc(dietId).get().toPromise()
      .then(doc => doc.data())
      .then(doc => this.mapDiet(doc));
  }

  private mapDiet(diet: any): Diet {
    const meals = diet.meals.map(meal => {
      const ingredients = meal.ingredients.map(mealIngredient => {
        const ingredient = mealIngredient.ingredient;
        return new MealIngredient(
          new Ingredient(
            ingredient.id,
            ingredient.name,
            ingredient.proteins,
            ingredient.carbohydrates,
            ingredient.fats,
            ingredient.nutritionValue),
          mealIngredient.weight
        );
      });
      return new Meal(meal.name, ingredients);
    });
    return new Diet(meals);
  }
}
