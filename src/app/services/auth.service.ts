import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;

  constructor(private firebaseAuth: AngularFireAuth) {
    firebaseAuth.user.subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  signInWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new auth.GoogleAuthProvider()
    )
  }

  signOut() {
    return this.firebaseAuth.auth.signOut();
  }
}
