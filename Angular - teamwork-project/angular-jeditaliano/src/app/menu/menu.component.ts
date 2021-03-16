import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartServiceService } from '../service/cart-service.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  foodIsAlreadyInCart = false;
  foodTypes: string[] = ['Salad', 'Pasta', 'Pizza', 'Dessert'];
  pendingCartList: any[] = [];
  foodList: any[] = [
    /* {foodName: "CAPRESE", foodType: "salad", foodPrice: "4.50 EUR", foodDescr:"Classic Caprese of imported mozzarella and cherry tomatoes. Served with fresh basil, basil pesto sauce, sundried tomato pesto and balsamic reduction. Topped with wild rocket and Balsamic dressing.", foodImg: "https://images.unsplash.com/photo-1571047399553-603e2138b646?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8c2FsYWR8ZW58MHx8MHw%3D&auto=format&fit=crop&w=500&q=60"},
    {foodName: "DI CESARE", foodType: "salad", foodPrice: "4.50 EUR", foodDescr:"Classic Caesar salad with crispy bacon and Parmesan. Served with grilled Cajun-marinated chicken breast and sundried tomato sauce.", foodImg: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTh8fHNhbGFkfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    {foodName: "INSALATA MISTA", foodType: "salad", foodPrice: "4.50 EUR", foodDescr:"Mixed green salad and vegetables. Served with truffle-tomato vinaigrette, black olives and Parmesan", foodImg: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHNhbGFkJTIwY2Vhc2FyfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    {foodName: "INSALATA GRECA", foodType: "salad", foodPrice: "4.50 EUR", foodDescr:"Traditional Greek salad of plum tomatoes, bell peppers, onion, cucumber, olives and feta cheese. Dressed with extra virgin olive oil and red wine vinegar.", foodImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"},
    
    {foodName: "SPAGHETTI ARABBIATA", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Spicy sauce made with Italian San Marzano tomatoes, fresh basil and chili. Topped with Parmigiano Reggiano.", foodImg: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=911&q=80"},
    {foodName: "FUSILLI ALLA BOLOGNESE", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Italian pancetta and selected cuts of beef and pork in a homemade Bolognese sauce. Topped With Parmigiano Reggiano.", foodImg: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"},
    {foodName: "FUNGHI E PROSCIUTTO", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Mixed wild mushrooms and carved ham in cream sauce.", foodImg: "https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"},
    {foodName: "FUSILLI AI FRUTTI DI MARE", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Mixed local seafood in a tomato and garlic marinara sauce.", foodImg: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"},
    {foodName: "PENNE ALLA CARBONARA", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Original Italian recipe with imported bacon, egg and a touch of cream. Topped with crispy bacon and Pecorino cheese.", foodImg: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"},
    {foodName: "SPAGHETTI ALLA MATRICIANA", foodType: "pasta", foodPrice: "4.50 EUR", foodDescr:"Italian bacon, San Marzano tomatoes and onions. Topped with Pecorino cheese.", foodImg: "https://images.unsplash.com/photo-1516685018646-549198525c1b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"},
    
    {foodName: "MARGHERITA", foodType: "pizza", foodPrice: "4.50 EUR", foodDescr:"Tomato, mozzarella cheese and fresh basil.", foodImg: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60"},
    {foodName: "VEGETARIANA", foodType: "pizza", foodPrice: "4.50 EUR", foodDescr:"Margherita pizza topped with eggplant, bell peppers,onion, mushroom, zucchini, black olives.", foodImg: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80"},
    {foodName: "HAWAIANA", foodType: "pizza", foodPrice: "4.50 EUR", foodDescr:"Margherita pizza topped with fresh pineapple and ham.", foodImg: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=714&q=80"},
    {foodName: "AI 4 FORMAGGI", foodType: "pizza", foodPrice: "4.50 EUR", foodDescr:"Margherita pizza topped with four cheeses - mozzarella, Gorgonzola, smoked Scamorza and Parmigiano Reggiano.", foodImg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80"},

    {foodName: "TIRAMISU", foodType: "dessert", foodPrice: "4.50 EUR", foodDescr:"Classic Italian dessert with layers of espresso-soaked Savoiardi biscuits and light Mascarpone mousse. Sprinkled with Amaretti biscuit crumbs.", foodImg: "https://images.pexels.com/photos/6403383/pexels-photo-6403383.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    {foodName: "CREMA CATALANA", foodType: "dessert", foodPrice: "4.50 EUR", foodDescr:"Classic vanilla cream brulee served with seasonal fruit.", foodImg: "https://images.unsplash.com/photo-1593974850481-ea9cf3a34249?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=988&q=80"},
    {foodName: "TORTA AL FORMAGGIO", foodType: "dessert", foodPrice: "4.50 EUR", foodDescr:"Classic cheesecake with amarene sour cherries and seasonal fruits.", foodImg: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"},
    {foodName: "AFFOGATO AL CAFFE", foodType: "dessert", foodPrice: "4.50 EUR", foodDescr:"Homemade vanilla ice cream topped with hot Illy Espresso Coffee.", foodImg: "https://images.unsplash.com/photo-1579954115563-e72bf1381629?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}, */
  ];

  constructor(private cartService: CartServiceService, private db: AngularFirestore) { 
    this.cartService.homePageIsActive.next(false);
  }

  ngOnInit(): void {
    this.getSalads();
    this.getFoodListToCart()

  }

  getSalads() {
    this.foodList = [];
    this.db
      .collection('foodList')
      .doc('uv9uk5A0U68wHLhK6ohu')
      .collection('Salad')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (datas) => {
          datas.forEach(data => {
            this.foodList.push(data);
          })
        },
        (err) => { console.log(err) },
     
      );
  }

  getPastas() {
    this.foodList = [];
    this.db
      .collection('foodList')
      .doc('uv9uk5A0U68wHLhK6ohu')
      .collection('Pasta')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (datas) => {
          datas.forEach(data => {
            this.foodList.push(data);
          })
        },
        (err) => { console.log(err) },
        
      );
  }

  getPizzas() {
    this.foodList = [];
    this.db
      .collection('foodList')
      .doc('uv9uk5A0U68wHLhK6ohu')
      .collection('Pizza')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (datas) => {
          datas.forEach(data => {
            this.foodList.push(data);
          })
        },
        (err) => { console.log(err) },
      
      );
  }

  getDesserts() {
    this.foodList = [];
    this.db
      .collection('foodList')
      .doc('uv9uk5A0U68wHLhK6ohu')
      .collection('Dessert')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (datas) => {
          datas.forEach(data => {
            this.foodList.push(data);
          })
        },
        (err) => { console.log(err) },
    
      );
  }


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


  addToPendingCart(food, id){
    this.foodIsAlreadyInCart = false;
    for(let foodName of this.pendingCartList){
      if(foodName == food.foodName){
       this.foodIsAlreadyInCart = true;
    }
  }

    if(!this.foodIsAlreadyInCart){
    this.db
    .collection('pendingCart')
    .add(food)
    }
  }
}
