import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Ingredient} from './model/ingredient';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private ingredientsCollection: AngularFirestoreCollection<Ingredient>;

  constructor(db: AngularFirestore) {
    this.ingredientsCollection = db.collection<Ingredient>('ingredients');
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.ingredientsCollection.valueChanges();
  }
}
