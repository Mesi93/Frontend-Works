import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServiceService } from '../service/cart-service.service';
import firebase from "firebase/app";
import "firebase/auth";







@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //Forms
  loginForm: FormGroup;
  registerForm: FormGroup;

  //Form variables
  userArr: any = [];
  userNameAvailable;
  displayUsernameErrorSmall: boolean = true;
  displayEmailErrorSmall: boolean = true;

  //Google Sign in variable
  provider: any;





  constructor(private formBuilder: FormBuilder, private db: AngularFirestore, private router: Router, private service: CartServiceService) { 
    this.service.homePageIsActive.next(false);
    
  }

  ngOnInit(): void {
    //RegisterForm
    this.initializeForm();

    //LoginForm
    this.loginForm = new FormGroup({

      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })

    //LocalStorage
    this.service.getLocalStorageDetails();




    //Login with GoOgle
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  //Registration

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ\d?]{6,}$/),
        this.userNameAlreadyTaken(this.db)
      ]),


      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ\D+]{6,}\w$/),
       /*  this.userNameAlreadyTaken(this.db) */

      ]),
      email: new FormControl('', [
        Validators.email,
        this.emailAlreadyTaken(this.db)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ0-9!?]{8,}$/),

      ]),
      rePassword: new FormControl('', [
        Validators.required,

      ]),
      terms: new FormControl(false, Validators.requiredTrue)
    }, {
      validators: this.passwordsAreMatch

    })
  }

  showInputValues() {

    //this.registerForm.value;

    let userObj = {
      email: this.registerForm.value.email,
      name: this.registerForm.value.name,
      username: this.registerForm.value.username,
      password: btoa(this.registerForm.value.password)
    }

    this.db.collection('users').add(userObj)
      .then(profile => {
        this.registerForm.reset();
        // this.router.navigate(['/account'])

      })
      .catch(err => console.log(err));
      
      this.loginForm.get('email').setValue(userObj.email);
      

  }

  passwordsAreMatch(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['rePassword'].value ? null : { 'mismatch': true };
  }



  userNameAlreadyTaken(db: AngularFirestore) {
    return (control: AbstractControl) => {

      const userName = control.value;

      let userCollection = db.collection('users', ref => ref.where('username', '==', userName));



      let result;



      userCollection.valueChanges().subscribe(
        (users) => { users.length ? this.displayUsernameErrorSmall = true : this.displayUsernameErrorSmall = false },
        (err) => { console.log(err) },
        () => { }
      )



      return result
    }


  }

  emailAlreadyTaken(db: AngularFirestore) {
    return (control: AbstractControl) => {

      const email = control.value;

      let userCollection = db.collection('users', ref => ref.where('email', '==', email));



      let result;



      userCollection.valueChanges().subscribe(
        (emails) => { emails.length ? this.displayEmailErrorSmall = true : this.displayEmailErrorSmall = false },
        (err) => { console.log(err) },
        () => { }
      )



      return result
    }
  }


  //Login
  userData: any;
  currentEmail: any;
  currentPassword: any;
  passwordOrEmailIsIncorrect:boolean = false;

  loginToPage() {

    const userObj = {
      email: this.loginForm.value.email,
      password: btoa(this.loginForm.value.password)
    }

    const loginUserCollection = this.db.collection('users', ref => ref.where('email', '==', userObj.email));
    
    loginUserCollection.snapshotChanges().subscribe(
      (data) => {
        data.map(user => {

          this.currentEmail = user.payload.doc.get('email')
          this.currentPassword = user.payload.doc.get('password')

        }
        )

        if (this.currentEmail === userObj.email && this.currentPassword === userObj.password) {
          localStorage.setItem('UserEmail', this.currentEmail);
          this.router.navigate(['account']);

          setTimeout(function(){ location.reload()}, 0);
        } else {
          this.passwordOrEmailIsIncorrect = true;
        }
      },
      (err) => { console.log(err) },
      () => { }
    )




  }

  loginWithGmail() {
    firebase.auth()
      .signInWithPopup(this.provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */

        // The signed-in user info.
        let user = result.user;

        localStorage.setItem('UserEmail', user.email);

        // ...
      })
      .then(() => {
        this.router.navigate(['account'])
      })

      .then(() => {
        setTimeout(function () { location.reload() }, 0);
      })

      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...

      });

  }



}