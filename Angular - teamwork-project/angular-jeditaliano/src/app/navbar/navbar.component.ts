import { Component, OnInit } from '@angular/core';
import { CartServiceService } from '../service/cart-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //Form
  darkModeForm: FormGroup;

  navBarDarkModeSwitcher = false;
  //LocalStorage variable
  storageAvailable = false;
  //for switch button
  homePageIsActive;
  //cart badge
  cartCounter: number = 0;


  constructor(private service: CartServiceService, private router: Router, private db: AngularFirestore) {
    this.darkModeForm = new FormGroup({
      darkModeSwitcher: new FormControl(true)
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('UserEmail')) {
      this.storageAvailable = true;
    } else {
      this.storageAvailable = false;
    }

    /* EMESE */
    //count items length in cart
    this.db.collection('pendingCart').valueChanges().subscribe(
      (data) => {
        this.cartCounter = data.length;

      },
      (err) => { console.log(err) },
    )
    //switch button display
    this.service.homePageIsActive.subscribe(
      (data) => {
        this.homePageIsActive = data;
      },
      (err) => { console.log(err) },
    )
  }


  

  signOut() {
    localStorage.removeItem('UserEmail');
    // this.router.navigate([""]);
    setTimeout(function () { location.reload() }, 0);
  }

  changeDarkMode = () => {
    this.navBarDarkModeSwitcher = this.darkModeForm.get('darkModeSwitcher').value;

    this.service.darkModeSwitcher.next(this.navBarDarkModeSwitcher);
  }

}
