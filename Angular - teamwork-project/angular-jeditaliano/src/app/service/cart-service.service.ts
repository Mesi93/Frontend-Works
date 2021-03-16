import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  foodActualStatus:any = new BehaviorSubject<any>(null);

  darkModeSwitcher = new BehaviorSubject<any>(null);

  foodsInCart:any = new BehaviorSubject<any>(null);

  //switch display 
  homePageIsActive = new BehaviorSubject<any>(true);

  constructor(private db: AngularFirestore) { }

   //LocalStorage
   getLocalStorageDetails() {
     if(localStorage.getItem('UserEmail')) {

      return localStorage.getItem('UserEmail')
     }
    
  }


}
