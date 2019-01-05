import {Injectable} from '@angular/core';
import {Diet} from '../model/diet';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DietService {
  constructor(private db: AngularFirestore, private auth: AuthService) {

  }

  saveDiet(diet: Diet) {
    const uid = this.auth.getUid();
    const dietObject = JSON.parse(JSON.stringify(diet));
    const path = `/users/${uid}/diets`;
    console.log(path);
    return this.db.collection(path).add(dietObject);
  }
}
