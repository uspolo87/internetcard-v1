import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class dbService {

  constructor(private firestore: AngularFirestore, private http: HttpClient) { }

  createCard(cardObject: object, userId: string) {
    return this.firestore.collection("cards").doc(userId).set(cardObject, { merge: true })
  }

  getCardData(userId: string) {
    return this.firestore.collection("cards").doc(userId).get();
  }

  searchCards(searchTerm: string) {
    return this.firestore.collection("userbasicDetails", ref => ref.where('search', 'array-contains', searchTerm)).valueChanges()
  }
  saveUserInfo(userId: string, userData: any) {
    // console.log(userId, userData);

    return this.firestore.collection("userbasicDetails").doc(userId).set(userData, { merge: true });
  }
  getUserInfo(userId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).get();
  }
  updateCardStatus(userId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).set({ "cardCreated": true }, { merge: true });
  }
  getSavedCards(userId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).collection("savedCard").valueChanges()
  }

  saveQuery(query: any) {
    return this.firestore.collection("userQueries").add(query);
  }
  addToSavedCards(userId: string, cardDetails: object, cardId: string) {
    // console.log(userId, cardDetails)
    return this.firestore.collection("userbasicDetails").doc(userId).collection("savedCard").doc("card" + cardId).set(cardDetails)
  }

  likeCard(userId: string, cardDetails: object, cardId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).collection("likes").doc("card" + cardId).set(cardDetails);
  }
  updateLike(userId: any, cardId: string) {
    return this.firestore.collection("cards").doc(cardId).update({ [`likes.${userId}`]: true })
  }
  unlikeCard(userId: string, cardId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).collection("likes").doc("card" + cardId).delete();
  }
  // firebase.firestore.FieldValue.delete()
  decreaseLike(userId: any, cardId: string) {
    return this.firestore.collection("cards")
      .doc(cardId)
      .update(
        {
          [`likes.${userId}`]: firebase.default.firestore.FieldValue.delete()
        }
      );
  }

  deleteSavedCards(userId: string, cardId: string) {
    // console.log(userId, cardDetails)
    return this.firestore.collection("userbasicDetails").doc(userId).collection("savedCard").doc("card" + cardId).delete();
  }

  getUserLikesInfo(userId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).collection("likes").valueChanges()
  }
  getSavedCardsInfo(userId: string) {
    return this.firestore.collection("userbasicDetails").doc(userId).collection("savedCard").valueChanges()
  }

  getCountryList() {
    return this.http.get("https://restcountries.com/v2/all?fields=name")
  }

}
