import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Ingredient} from './model/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private ingredientsCollection: AngularFirestoreCollection<Ingredient>;

  constructor(db: AngularFirestore) {
    this.ingredientsCollection = db.collection('ingredients');
  }

  getIngredients(): Promise<Ingredient[]> {
    return this.ingredientsCollection.get().toPromise()
      .then(snapshot => snapshot.docs.map(doc => <Ingredient>doc.data()));
  }
}
