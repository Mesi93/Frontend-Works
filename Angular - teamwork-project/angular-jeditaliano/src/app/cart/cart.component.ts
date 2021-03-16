import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServiceService } from '../service/cart-service.service';
//import { Firestore, firestore } from 'firebase/app';
import firebase from "firebase/app";
import "firebase/auth";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @ViewChild('quantityInput') quantityInput: any;
  cartFoodList: any[] = [];
  user: any;

  /* display cart elements*/
  orderWithoutAccountIsActive: boolean = false;
  alreadySignedInIsActive: boolean = false;
  registrateIsActive: boolean = false;
  loginIsActive: boolean = true;
  orderIsPlaced: boolean = false;
  cartIsEmptyIsActive: boolean = false;
  orderIsNotPlaced: boolean = true;
  totalPrice;

  loggedInUserId:string;
  cuopons: any;

  /* order form */
  orderForm: FormGroup;

  /*registration*/
  registerForm: FormGroup;
  userArr: any = [];
  userNameAvailable:boolean;
  displayUsernameErrorSmall: boolean = true;
  displayEmailErrorSmall: boolean = true;

  /*login*/
  loginForm: FormGroup;

  //Google Sign in variable
  provider: any;

  //User Coupons
  pastaCoupon:boolean = false;
  desserCoupon:boolean = false;
  pizzaCoupon:boolean = false;
  saladCoupon:boolean = false;

  //if one coupon is used, the others are unavailable
  couponsAreAvailable:boolean = false;


  //check foodTypes in Cart
  pastaIsInCart: boolean = false;
  dessertIsInCart: boolean = false;
  pizzaIsInCart: boolean = false;
  saladIsInCart: boolean = false;

  //Cart List
  actualCartList = this.cartFoodList;

  //total Price
  totalDiscountPrice:number;

  listOfOthers:any = [];

  constructor(
    private db: AngularFirestore,
    private cartService: CartServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {

    //Display switch button
    this.cartService.homePageIsActive.next(false);
  }


  ngOnInit(): void {


    this.loginIsActive = true;

    //LoginForm
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })

    //Login with GoOgle
    this.provider = new firebase.auth.GoogleAuthProvider();

    //RegisterForm
    this.initializeForm();

    //OrderForm
    this.orderForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/((?:\+?3|0)6)(?:-|\()?(\d{1,2})(?:-|\))?(\d{3})-?(\d{3,4})/g)]),
      postcode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
      address: new FormControl('', [Validators.required, Validators.minLength(3)])

    });

    //Check Local Storage
    this.checkLocalStorage()

    this.getFoodListToCart();

    //Check coupons
    this.userHasCoupons();

    //Check if cart is empty
    if (this.cartFoodList.length < 1) {
      this.cartIsEmptyIsActive = true;
    } else {
      this.cartIsEmptyIsActive = false;
    }
  }


  //------- EMESE ---------/

  checkLocalStorage() {
    if (this.cartService.getLocalStorageDetails()) {
      this.alreadySignedInIsActive = true;
      this.loginIsActive = false;
    }
  }

  //RENDER FOODS IN CART
  getFoodListToCart() {
    this.db
      .collection('pendingCart')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (foodList) => {
          foodList.forEach((food: any) => {
            /*   const alreadyExistInCart = this.cartFoodList.some(item => item.foodName == food.foodName);
              if (!alreadyExistInCart) { */
            this.cartFoodList.push(food);
            this.checkFoodTypesInCart(this.cartFoodList)
            this.countAllPrice();
            if (this.cartFoodList.length > 0) {
              this.cartIsEmptyIsActive = false;
            } else {
              this.cartIsEmptyIsActive = true;
            }
          })
        },
        (err) => { console.log(err) },
       )
  }

  deleteFromCart(id: string) {
    this.cartFoodList = [];
    this.db.collection('pendingCart').doc(id).delete();
    if (this.cartFoodList.length < 1) {
      this.cartIsEmptyIsActive = true;
    } else {
      this.cartIsEmptyIsActive = false;
    }
  }

  deleteAllFromCart() {
    this.db.collection('pendingCart').get().subscribe(
      (datas) => {
        datas.forEach(data => {
          this.db.collection('pendingCart').doc(data.id).delete()
        })
      },
      (err) => { console.log(err) }
    );
  }

  //INCREASE OR DECREASE QUANTITY
  increaseQuantity(index, price) {

    let input = (document.getElementById(index) as HTMLInputElement);
    let quantityInputValue = (document.getElementById(index) as HTMLInputElement).value;
    input.valueAsNumber = parseInt(quantityInputValue) + 1;
    if (input.valueAsNumber > 10) {
      input.valueAsNumber = 10;
      this.countAllPrice()
    } else if (input.valueAsNumber <= 10) {
      this.cartFoodList[index].foodPrice = price + this.cartFoodList[index].defaultPrice;
      this.cartFoodList[index].foodPrice = +this.cartFoodList[index].foodPrice.toFixed(1);
      this.countAllPrice()
    }
  }

  decreaseQuantity(index, price, id) {
    let input = (document.getElementById(index) as HTMLInputElement);
    let quantityInputValue = (document.getElementById(index) as HTMLInputElement).value;
    input.valueAsNumber = parseInt(quantityInputValue) - 1;
    if (input.valueAsNumber < 0) {
      input.valueAsNumber = 0;
      this.countAllPrice()
    } else if (input.valueAsNumber > 0) {
      this.cartFoodList[index].foodPrice = +(this.cartFoodList[index].foodPrice - this.cartFoodList[index].defaultPrice).toFixed(1);
      this.countAllPrice()
    } else if (input.valueAsNumber == 0) {
      this.cartFoodList[index].foodPrice = 0;
      this.countAllPrice();
      this.deleteFromCart(id)
    }
  }


  //TOTAL PRICE
  countAllPrice() {
    this.totalPrice = this.cartFoodList.map((meal) => meal.foodPrice).reduce((price1, price2) => price1 + price2)
    this.totalPrice = this.totalPrice.toFixed(1);
  }

  getUserData() {
    const userEmail = this.cartService.getLocalStorageDetails();
    const user = this.db.collection('users', ref => ref.where('email', '==', userEmail));
    user.valueChanges().subscribe(
      (user) => {
        this.user = user[0];
      },
      (err) => console.log(err)
    )
  }
  

  // DISPLAY - CHANGE CURRENT DATA BOX

  displayOrderWithoutAccount() {
    this.orderWithoutAccountIsActive = true;
    this.loginIsActive = false;
  }

  displayRegistrate() {
    this.registrateIsActive = true;
    this.loginIsActive = false;
  }

  placeOrder() {
    if (this.alreadySignedInIsActive) {

      this.getUserId()
      this.orderIsPlaced = true;
      this.registrateIsActive = false;
      this.loginIsActive = false;
      this.alreadySignedInIsActive = false;
      this.orderWithoutAccountIsActive = false;
      this.orderIsNotPlaced = false;

    } else {
      this.orderIsPlaced = true;
      this.registrateIsActive = false;
      this.loginIsActive = false;
      this.alreadySignedInIsActive = false;
      this.orderWithoutAccountIsActive = false;
      this.orderIsNotPlaced = false;
      this.deleteAllFromCart();
    }
  }

  backToLogin() {
    this.loginIsActive = true;
    this.orderWithoutAccountIsActive = false;
    this.registrateIsActive = false;
  }

  register() {
    this.registrateIsActive = false;
    this.loginIsActive = true;
    location.reload();
  }



  // ------------------------- GÁBOR SECTION  ---------------------------


  /* DISCOUNT & COUPONS */

  countDiscountPrice(cartFoodList) {

    this.totalPrice = cartFoodList.map((meal) => meal.foodPrice).reduce((price1, price2) => price1 + price2)
    this.totalPrice = this.totalPrice.toFixed(1);
    return
  }

  userHasCoupons() {
    const userEmail = this.cartService.getLocalStorageDetails();
    const resp = this.db.collection('users');

    let listOfUsers = [];
    let listOfHasCoupons = [];

    resp.snapshotChanges().subscribe(
      (userList) => {
        userList.forEach(user => {
          listOfUsers.push(user.payload.doc.data());
        })
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
              this.desserCoupon = true;
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

  discountDessert = () => {
    const resp = this.db.collection('pendingCart');

    let listOfProducts = [];
    let listOfDessert = [];
    let actDessertName: any;
    let actCartList = [];
    this.actualCartList = [];

    ////////////////
    
    /* EMESE */

     /* for(let food of this.cartFoodList){
      if(food.foodType === 'Dessert'){
        console.log('dessert');
        food.foodPrice =  +((food.foodPrice * 0.95 ).toFixed(2))
      }
    }
    this.updateCoupons('dessert');
        setTimeout(() => {
          this.desserCoupon = false;
        },500)  

    this.countDiscountPrice(this.cartFoodList); */

      
   resp.get().subscribe(
      (items) => {
        items.forEach(item => listOfProducts.push(item.data()))

        listOfProducts.filter(product => {

          if (product.foodType === "Dessert") {
            listOfDessert.push(product);
          } else {
            this.listOfOthers.push(product);
          }
        })

        for (let dessert of listOfDessert) {
          actDessertName = dessert.foodName;
          for (let food of this.cartFoodList) {
            if (food.foodName === actDessertName) {
              if (actCartList.indexOf(food) == actCartList.lastIndexOf(food)) {
                food.foodPrice =  +((food.foodPrice * 0.95 ).toFixed(2))
                actCartList.push(food);
              }
            }
          }
        }
        for (let food of this.cartFoodList) {
          if (food.foodType !== "Dessert") {
            actCartList.push(food);

          }
        }
        this.updateCoupons('dessert');
        setTimeout(() => {
          this.desserCoupon = false;
        },500) 
        
         
        this.cartFoodList = actCartList;
        this.countDiscountPrice(actCartList);

      },
      (err) => { console.log(err) },
      () => {}
    ) 
  } 


  discountPizza = () => {
    const resp = this.db.collection('pendingCart');


    let listOfProducts = [];
    let listOfPizza = [];
    let actPizzaName: any;
    let actCartList = [];
    this.actualCartList = [];

    ////////////////

    resp.get().subscribe(
      (items) => {
        items.forEach(item => listOfProducts.push(item.data()))
        listOfProducts.filter(product => {
          if (product.foodType === "Pizza") {
            listOfPizza.push(product);
          } else {
            this.listOfOthers.push(product);
          }
        })
        for (let pizza of listOfPizza) {
          actPizzaName = pizza.foodName;
          for (let food of this.cartFoodList) {
            if (food.foodName === actPizzaName) {
              if (actCartList.indexOf(food) == actCartList.lastIndexOf(food)) {
                food.foodPrice = +((food.foodPrice * 0.8 ).toFixed(2))

                
                actCartList.push(food);
              }
            }
          }
        }
        for (let food of this.cartFoodList) {
          if (food.foodType !== "Pizza") {
            actCartList.push(food);
          }
        }
        this.updateCoupons('pizza');
        setTimeout(() => {
          this.pizzaCoupon = false;
        },500) 

        this.cartFoodList = actCartList;
        this.countDiscountPrice(actCartList);
      },
      (err) => { console.log(err) },
    )

  }

  discountPasta = () => {
    const resp = this.db.collection('pendingCart');
    let listOfProducts = [];
    let listOfPasta = [];
    let actPastaName: any;
    let actCartList = [];
    this.actualCartList = [];

    ////////////////

    resp.get().subscribe(
      (items) => {
        items.forEach(item => listOfProducts.push(item.data()))
        listOfProducts.filter(product => {
          if (product.foodType === "Pasta") {
            listOfPasta.push(product);
          } else {
            this.listOfOthers.push(product);
          }
        })
        for (let pasta of listOfPasta) {
          actPastaName = pasta.foodName;
          for (let food of this.cartFoodList) {
            if (food.foodName === actPastaName) {
              if (actCartList.indexOf(food) == actCartList.lastIndexOf(food)) {
                food.foodPrice = +((food.foodPrice * 0.9 ).toFixed(2))
                actCartList.push(food);
              }
            }
          }
        }
        for (let food of this.cartFoodList) {
          if (food.foodType !== "Pasta") {
            actCartList.push(food);
          }
        }
        
        this.updateCoupons('pasta');
        setTimeout(() => {
          this.pastaCoupon = false;
        },500) 
        
        this.cartFoodList = actCartList;
        this.countDiscountPrice(actCartList);

      },
      (err) => { console.log(err) },
    )
  }


  discountSalad = () => {
    const resp = this.db.collection('pendingCart');
    let listOfProducts = [];
    let listOfSalad = [];
    let actSaladName: any;
    let actCartList = [];
    this.actualCartList = [];

    ////////////////

    resp.get().subscribe(
      (items) => {
        items.forEach(item => listOfProducts.push(item.data()))
        listOfProducts.filter(product => {
          if (product.foodType === "Salad") {
            listOfSalad.push(product);
          } else {
            this.listOfOthers.push(product);
          }
        })
        for (let salad of listOfSalad) {
          actSaladName = salad.foodName;
          for (let food of this.cartFoodList) {
            if (food.foodName === actSaladName) {
              if (actCartList.indexOf(food) == actCartList.lastIndexOf(food)) {
                food.foodPrice = +((food.foodPrice * 0.85 ).toFixed(2));
                actCartList.push(food);
              }
            }
          }
        }
        for (let food of this.cartFoodList) {
          if (food.foodType !== "Salad") {
            actCartList.push(food);
          }
        }
        this.updateCoupons('salad');
        setTimeout(() => {
          this.saladCoupon = false;
        },500) 

        this.cartFoodList = actCartList;
        this.countDiscountPrice(actCartList);

      },
      (err) => { console.log(err) },
    )
  }


  checkFoodTypesInCart(list) {
    for (let food of list) {
      if (food.foodType === 'Pasta') {
        this.pastaIsInCart = true;
      }
      if (food.foodType === 'Pizza') {
        this.pizzaIsInCart = true;
      }
      if (food.foodType === 'Dessert') {
        this.dessertIsInCart = true;
      }
      if (food.foodType === 'Salad') {
        this.saladIsInCart = true;
      }
    }
  }

  updateCoupons(choosenCoupon:string) {
    let userId;
    //let couponType = choosenCoupon;
    let userCoupons:any;
    //IF 1 COUPON IS USED OTHERS ARE INVALID
    this.pastaIsInCart = false;
    this.pizzaIsInCart = false;
    this.dessertIsInCart = false;
    this.saladIsInCart = false;
    
    const userEmail = this.cartService.getLocalStorageDetails();
    const user = this.db.collection('users', ref => ref.where('email', '==', userEmail));
    user.get().subscribe(
      (data)=>{
        data.forEach(
          (user:any) => {
            userId = user.id;
            let coupons = Object.keys(user.data().cuopons);
            let values:Array<boolean> = Object.values(user.data().cuopons);

            const couponsObj = {
              dessert: false,
              pizza: false,
              pasta: false,
              salad: false
            }

            for(let [index, coupon] of coupons.entries()){


              //FELVEGYÉK AZ EREDETI ÉRTÉKÜKET
              if(coupon === 'salad'){
                couponsObj.salad = values[index];
              }
              if(coupon === 'pasta'){
                couponsObj.pasta = values[index];
              }
              if(coupon === 'pizza'){
                couponsObj.pizza = values[index];
              }
              if(coupon === 'dessert'){
                couponsObj.dessert = values[index];
              }
              
             //KIVÁLASZTOTT LEGYEN FALSE
              
              if(choosenCoupon === 'dessert'){
                couponsObj.dessert = false;
              }
              if(choosenCoupon === 'pizza'){
                couponsObj.pizza = false;
              }
              if(choosenCoupon === 'pasta'){
                couponsObj.pasta = false;
              }
              if(choosenCoupon === 'salad'){
                couponsObj.salad = false;
              }
            }
            this.db.collection('users').doc(userId).set({cuopons: couponsObj},{merge:true})

        })
      },
      (err)=>{console.log(err)},
    )
  }
     
      


  // ------------------------- TIBI ---------------------------
  getUserId() {

    const userEmail = this.cartService.getLocalStorageDetails();
    
    const resp = this.db.collection('users', ref => ref.where('email', '==', userEmail));
    resp.snapshotChanges().subscribe(
      (user) => {
      
        this.loggedInUserId = user[0].payload.doc.id
       
      },
      (err) => console.log(err),
      () => { console.log('FINISHEEEEEEEED') }
    )
    setTimeout(() => {
      this.saveOrderToUser(this.loggedInUserId)
    }, 500)
  }

  saveOrderToUser(id) {

    let user1 = {};
    for (let food of this.cartFoodList) {
      food.orderedDate = new Date().toDateString();
    }

    this.db.collection('users').doc(id).get().subscribe(
      (user) => {
        user1 = user.data()
        this.readUserData(user1);
      },
      (err) => {console.log(err)},
      () => { }
    );
  }

  readUserData(user: any) {
    let prevOrders = user.previousOrders;
    if (prevOrders) {
      for (let food of this.cartFoodList) {
        prevOrders.push(food)
      }

    } else {
      prevOrders = this.cartFoodList
    }


    this.db.collection('users')
      .doc(this.loggedInUserId)
      .set({ previousOrders: prevOrders }, { merge: true })
      .then(() => {
        this.cartFoodList = [];
        this.deleteAllFromCart()
      })
      .catch(err => console.log(err))
  }

  // ------------ TIBI SECTION VÉGE -------------


  //REGISTRATION

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

    let userObj = {
      email: this.registerForm.value.email,
      name: this.registerForm.value.name,
      username: this.registerForm.value.username,
      password: btoa(this.registerForm.value.password)
    }
    this.db.collection('users').add(userObj)
      .then(profile => {
        this.registerForm.reset();
        this.register();

      })
      .catch(err => console.log(err));
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


  //LOGIN
  userData: any;
  currentEmail: any;
  currentPassword: any;
  passwordOrEmailIsIncorrect: boolean = false;

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
          this.checkLocalStorage()
          setTimeout(function () { location.reload() }, 0);

        } else {
          this.passwordOrEmailIsIncorrect = true;
        }
      },
      (err) => { console.log(err) },
      () => { }
    )

  }


  // LOGIN WITH GMAIL

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


  /*-------------------- Gábor  ---------------------- */

  // ORDER STATUS

  cartGifList: Array<any> = [
    { imgUrl: "https://i.pinimg.com/originals/91/90/8a/91908ad2f9aef293ed840739a291e9db.gif", text: "Process Food Orders and Payments." },
    { imgUrl: "https://i.pinimg.com/originals/b2/30/04/b23004d2c4c4ef2f8769d53f8e0b5d75.gif", text: "Your food is being prepared." },
    { imgUrl: "https://i.pinimg.com/originals/89/9a/e8/899ae8d7375edb60310c8daa8d6bb8ed.gif", text: "Your food is being prepared." },
    { imgUrl: "https://i.pinimg.com/originals/29/87/fd/2987fd6ac481155d7868fdab4d79b0ec.gif", text: "Your order is about to arrive in 30 minutes" }
  ]

  actualStatus: string;

  actualImg: string = this.cartGifList[0].imgUrl;
  actualText: string = this.cartGifList[0].text;

  changeActualImgAndText = () => {

    (document.querySelector('.order-data') as HTMLElement).style.border = 'none';


    setTimeout(() => {
      this.actualImg = this.cartGifList[0].imgUrl;
      this.actualText = this.cartGifList[0].text;

      this.actualStatus = this.cartGifList[0].text;
      this.cartService.foodActualStatus.next(this.actualStatus);
    }, 3000);


    setTimeout(() => {
      this.actualImg = this.cartGifList[1].imgUrl;
      this.actualText = this.cartGifList[1].text;

      this.actualStatus = this.cartGifList[1].text;
      this.cartService.foodActualStatus.next(this.actualStatus);
    }, 9000);

    setTimeout(() => {
      this.actualImg = this.cartGifList[2].imgUrl;
      this.actualText = this.cartGifList[2].text;
    }, 18000);


    setTimeout(() => {
      this.actualImg = this.cartGifList[3].imgUrl;
      this.actualText = this.cartGifList[3].text;

      this.actualStatus = this.cartGifList[3].text;
      this.cartService.foodActualStatus.next(this.actualStatus);
    }, 56000);

    setTimeout(() => {
      this.actualStatus = 'Delivered';
      this.cartService.foodActualStatus.next(this.actualStatus);
    });

  }

}
