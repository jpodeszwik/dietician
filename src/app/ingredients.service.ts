import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Ingredient} from './model/ingredient';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private ingredientsCollection: AngularFirestoreCollection<Ingredient>;

  constructor(private db: AngularFirestore) {
  }

  getIngredients(): Promise<Ingredient[]> {
    return this.db.collection<Ingredient>('ingredients').get().toPromise()
      .then(snapshot => snapshot.docs.map(doc => <Ingredient>doc.data()));
  }
}
