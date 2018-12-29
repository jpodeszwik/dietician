import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Ingredient } from './ingredient';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private ingredientsCollection: AngularFirestoreCollection<Ingredient>;
  private ingredients: Promise<Ingredient[]>;

  constructor(db: AngularFirestore) {
    this.ingredientsCollection = db.collection<Ingredient>('ingredients');
    this.ingredients = this.ingredientsCollection.valueChanges()
      .pipe(take(1))
      .toPromise();
  }

  getIngredients(): Promise<Ingredient[]> {
    return this.ingredients;
  }
}
