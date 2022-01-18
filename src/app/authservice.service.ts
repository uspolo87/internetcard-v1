import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { first } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable()
export class AuthService {




  constructor(private firebaseAuth: AngularFireAuth) {
    firebaseAuth.authState.subscribe(user => {
      //  console.log(user);
    })

  }

  signup(email: string, password: string) {
    return this.firebaseAuth
      .createUserWithEmailAndPassword(email, password);

  }

  sendPasswordResetLink(email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email)
  }

  loginWithGoogle() {
    return this.firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFacebook() {
    return this.firebaseAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.firebaseAuth
      .signOut();
  }

  userStatus() {
    return this.firebaseAuth.authState.pipe(first()).toPromise();
  }



}


