import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { element } from 'protractor';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  //PENDING CART 
  pendingCartList: Array<string> = [];
  foodIsAlreadyInCart: boolean = false;
  showAddedToCartModal: boolean = false;


  //order status gifek
  cartGifList: Array<any> = [
    { imgUrl: "https://i.pinimg.com/originals/91/90/8a/91908ad2f9aef293ed840739a291e9db.gif", text: "Process Food Orders and Payments." },
    { imgUrl: "https://i.pinimg.com/originals/b2/30/04/b23004d2c4c4ef2f8769d53f8e0b5d75.gif", text: "Your food is being prepared." },
    { imgUrl: "https://i.pinimg.com/originals/89/9a/e8/899ae8d7375edb60310c8daa8d6bb8ed.gif", text: "Your food is being prepared." },
    { imgUrl: "https://i.pinimg.com/originals/29/87/fd/2987fd6ac481155d7868fdab4d79b0ec.gif", text: "Your order is about to arrive in 30 minutes" }
  ]


  //input mező referencia változók

  @ViewChild('userChangeEmail') changeEmailInput: any
  @ViewChild('userDeliveryAddress') deliveryAddresInput: any;
  @ViewChild('userSecondaryEmailAddress') secondaryEmailInput: any;
  @ViewChild('userPwReminder') pwReminderInput: any;
  @ViewChild('userPassword') userPassword: any


  //Order status visible
  gotOrderStatus: boolean = false;


  changeEmailForm: FormGroup;
  changePwForm: FormGroup;
  redeemCodeForm: FormGroup;
  displayEmailErrorSmall: boolean = true;

  //modal validator variables
  currentPwIsInvalid: boolean = false;
  newEmailIsInvalid: boolean = true;
  currentPwForChangePwIsInvalid: boolean = false;

  currentOrderStatus: string = "";
  currentOrderObj: any = {};


  //User Coupons
  pastaCoupon = false;
  dessertCoupon = false;
  pizzaCoupon = false;
  saladCoupon = false;


  //localstorage-hoz változók
  localEmail: string = "";
  userFromDb: any = {};
  previousOrders: Array<any> = [];
  userFromDbID: string = "";


  couponsIsActive: boolean = false;
  ordersIsActive: boolean = false;
  reservationsIsActive: boolean = false;

  //Redeem Code Validation
  redeemCodeInvalid:boolean = false;


  constructor(private db: AngularFirestore, private cartService: CartServiceService) {
    this.cartService.homePageIsActive.next(false);
    //this.setLocalStorage()

    this.changePwForm = new FormGroup({
      oldUserPassword: new FormControl(),
      newUserPassword: new FormControl('', [Validators.required, Validators.pattern(/^[a-zéáűőúóíüöA-ZÉÁŰÚŐÍÖÜÓ0-9!?]{8,}$/)])
    })

    this.redeemCodeForm = new FormGroup({
      code: new FormControl()
    })
  }

  ngOnInit(): void {
    this.showLocalStorageItem();
    this.getUsersFromDb();
    this.userHasCoupons();
    this.getFoodListToCart();
    this.cartService.foodActualStatus.subscribe(
      (data: string) => {
        this.changeOrderStatus(data);
        if (data) {
          this.gotOrderStatus = true;
        }
      },
      (err) => { console.log(err) },
    );

    this.changeEmailForm = new FormGroup({
      userChangeEmail: new FormControl("", [Validators.required, Validators.email, this.emailAlreadyTaken(this.db)]),
      userPassword: new FormControl("", [Validators.required])
    })


  }




  //localstorage 

  showLocalStorageItem() {
    this.localEmail = localStorage.getItem('UserEmail');
  }


  getUsersFromDb() {
    const getUser = this.db.collection('users', ref => ref.where('email', '==', this.localEmail));
    //ID lekérés: csak snapshotChanges()-el!!!
    getUser.snapshotChanges().subscribe(
      (data) => {
        //console.log(data[0].payload.doc.id) 
        this.userFromDbID = data[0].payload.doc.id
        //data.map(user => console.log(user.payload.doc.id))

      },
      (err) => console.log(err),
    )
    getUser.valueChanges().subscribe(
      (data) => {
        this.userFromDb = data[0];
        this.previousOrders = this.userFromDb.previousOrders
        //console.log(this.previousOrders);
      },
      (err) => console.log(err),
    );
  }


  //------ CHECK USER'S COUPONS

  userHasCoupons() {
    const userEmail = this.cartService.getLocalStorageDetails();
    const resp = this.db.collection('users');

    let listOfUsers = [];
    let listOfHasCoupons = [];

    resp.snapshotChanges().subscribe(
      (userList) => {
        userList.forEach(user => { listOfUsers.push(user.payload.doc.data()) })
        listOfUsers.filter(user => {
          if (user.cuopons) {
            listOfHasCoupons.push(user);
          }
        })
        for (let userHasCoupon of listOfHasCoupons) {
          if (userHasCoupon.email === userEmail) {
            if (userHasCoupon.cuopons.pizza === true) {
              this.pizzaCoupon = true;
            }
            if (userHasCoupon.cuopons.pasta === true) {
              this.pastaCoupon = true;
            }
            if (userHasCoupon.cuopons.dessert === true) {
              this.dessertCoupon = true;
            }
            if (userHasCoupon.cuopons.salad === true) {
              this.saladCoupon = true;
            }
          }
        }
      },
      (err) => console.log(err),
    )
  }






  // ------------- CHANGE CURRENT DATA BOX -----------

  showCoupons() {
    this.ordersIsActive = false;
    this.reservationsIsActive = false;
    this.couponsIsActive = true;

  }

  showOrders() {
    this.couponsIsActive = false;
    this.reservationsIsActive = false;
    this.ordersIsActive = true;
  }

  showOrderStatus() {
    this.couponsIsActive = false;
    this.ordersIsActive = false;
    this.reservationsIsActive = true;
  }







  // --------------- CHANGE USER DATA METHODS -------------

 
  setupDeliveryAddress() {
    this.db
      .collection('users')
      .doc(this.userFromDbID)
      .set({ address: this.deliveryAddresInput.nativeElement.value }, { merge: true })
  }



  setupSecondaryEmail() {
    this.db
      .collection('users')
      .doc(this.userFromDbID)
      .set({ secondaryEmail: this.secondaryEmailInput.nativeElement.value }, { merge: true })
  }

  setupPwReminder() {
    this.db
      .collection('users')
      .doc(this.userFromDbID)
      .set({ pwReminder: this.pwReminderInput.nativeElement.value }, { merge: true })
  }


  // ---------- FORM INPUT VALIDATORS ---------------

  emailAlreadyTaken(db: AngularFirestore) {
    return (control: AbstractControl) => {

      const email = control.value;

      let userCollection = db.collection('users', ref => ref.where('email', '==', email));

      let result;


      userCollection.valueChanges().subscribe(
        (userArr) => {
          userArr.length ? this.displayEmailErrorSmall = true : this.displayEmailErrorSmall = false
        },
        (err) => { console.log(err) }
      )

      return result;
    }
  }

  changeEmail() {

    let givenNewEmail = this.changeEmailForm.value.userChangeEmail;
    let userPw = this.changeEmailForm.value.userPassword;
    let currentEmail;
    let currentPassword;

    const loginUserCollection = this.db.collection('users', ref => ref.where('email', '==', this.localEmail));

    loginUserCollection.snapshotChanges().subscribe(
      (data) => {
        data.map(user => {

          currentEmail = user.payload.doc.get('email');
          currentPassword = user.payload.doc.get('password');

          if (userPw === atob(currentPassword)) {
            this.db
              .collection('users')
              .doc(this.userFromDbID)
              .set({ email: givenNewEmail }, { merge: true })
              .then(() => { console.log() })
              .then(() => {
                localStorage.removeItem('UserEmail');
              })
              .then(() => {
                localStorage.setItem('UserEmail', givenNewEmail)
              })
              .then(() => { location.reload() })
              .catch(err => { console.log(err) })
          } else {
            this.currentPwIsInvalid = true;
          }
        })
      },
      (err) => { console.log(err) }
    )
  }

  changePassword() {
    let oldPassword = this.changePwForm.value.oldUserPassword;
    let newPassword = this.changePwForm.value.newUserPassword;
    //console.log(atob(this.userFromDb.password))

    if (oldPassword === atob(this.userFromDb.password)) {
      this.db
        .collection('users')
        .doc(this.userFromDbID)
        .set({ password: btoa(newPassword) }, { merge: true })
        .then(() => console.log())
        .then(() => {
          this.changePwForm.reset()
          this.currentPwForChangePwIsInvalid = false;
        })
    } else {
      this.currentPwForChangePwIsInvalid = true;
    }
  }



  changeOrderStatus(status: string) {
    this.currentOrderStatus = status;
    //console.log(this.currentOrderStatus);

    for (let status of this.cartGifList) {
      if (status.text === this.currentOrderStatus) {
        this.currentOrderObj = status;
      }
    }

  }
  // -------------- ADD TO CART --------------

  //get pendingcart datas
  getFoodListToCart() {
    this.db
      .collection('pendingCart')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (foodList) => {
          foodList.forEach((food: any) => {
            this.pendingCartList.push(food.foodName);
          })
        },
        (err) => { console.log(err) },
      )
  }


  //add to cart
  addToPendingCart(food: any) {

    for (let foodName of this.pendingCartList) {
      if (foodName == food.foodName) {
        this.foodIsAlreadyInCart = true;
      }
    }

    if (!this.foodIsAlreadyInCart) {
      this.showAddedToCartModal = true;
      setTimeout(() => {
        this.showAddedToCartModal = false;
      }, 2000)
      this.db
        .collection('pendingCart')
        .add(food)
    }


  }



  // -------------- REDEEM CODE ---------------

  redeemCode() {
    const givenCode = this.redeemCodeForm.value.code;
    
    if((givenCode === "tanfolyam_vege_salad") || (givenCode === "tanfolyam_vege_pizza") || (givenCode === "tanfolyam_vege_pasta") || (givenCode === "tanfolyam_vege_dessert") ) {
      this.redeemCodeInvalid = false;
      
    }else {
      this.redeemCodeInvalid = true;
     
      
    }
    
    const couponCodes: Array<any> = [
      {
        type: "salad",
        code: "tanfolyam_vege_salad"
      },
      {
        type: "pizza",
        code: "tanfolyam_vege_pizza"
      },
      {
        type: "pasta",
        code: "tanfolyam_vege_pasta"
      },
      {
        type: "dessert",
        code: "tanfolyam_vege_dessert"
      }
    ]

    
    const couponsObj = {
      dessert: false,
      pizza: false,
      pasta: false,
      salad: false
    }
    // ----------- GET USER COUPONS ------------
    const userEmail = this.cartService.getLocalStorageDetails();
    const user = this.db.collection('users', ref => ref.where('email', '==', userEmail));
    user.get().subscribe(
      (data) => {
        data.forEach(
          (user: any) => {
            let coupons: Array<string> = Object.keys(user.data().cuopons);
            let values: Array<boolean> = Object.values(user.data().cuopons);

            for (let [index, coupon] of coupons.entries()) {
              //FELVEGYÉK AZ EREDETI ÉRTÉKÜKET
              if (coupon === 'salad') {
                couponsObj.salad = values[index];
              }

              if (coupon === 'pasta') {
                couponsObj.pasta = values[index];
              }


              if (coupon === 'pizza') {
                couponsObj.pizza = values[index];
              }

              if (coupon === 'dessert') {
                couponsObj.dessert = values[index];
              }
            }
            // hozzá adja az új kupont 

            //SALAD
            if (givenCode === "tanfolyam_vege_salad") {
              couponsObj.salad = true;
            }

            //PIZZA
            if (givenCode === "tanfolyam_vege_pizza") {
              couponsObj.pizza = true;
            }

            //PASTA
            if (givenCode === "tanfolyam_vege_pasta") {
              couponsObj.pasta = true;
            }

            //DESSERT
            if (givenCode === "tanfolyam_vege_dessert") {
              couponsObj.dessert = true;
            }


            this.db
              .collection('users')
              .doc(this.userFromDbID)
              .set({ cuopons: couponsObj }, { merge: true })
              .then(() => {
                this.redeemCodeForm.reset();
              })
              .catch(err => console.log(err))
          })
      },
      (err) => { console.log(err) },
    )
  }



}
