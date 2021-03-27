import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CartServiceService } from '../service/cart-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Dark-light mode variable
  darkMode = false;

  //Google maps latitude longitude
  lat = 47.511262204654194;
  lng = 19.05465256174719;

  /* EMESE*/
  //for menu cards
  firstCardActualImg: string = "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  secondCardActualImg: string = "https://images.pexels.com/photos/3649208/pexels-photo-3649208.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";
  thirdCardActualImg: string = "https://images.unsplash.com/photo-1613478880841-0a856df5c713?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1353&q=80";

  firstCard = [
    { foodName: 'Bocconcini di carne in nido di sfoglia', foodImage: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
    { foodName: 'Bruschette con maiale al curry', foodImage: "https://images.unsplash.com/photo-1592757063751-8957c6619772?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" },
    { foodName: 'Uova al prosciutto', foodImage: "https://images.unsplash.com/photo-1603356887214-0441954124ae?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { foodName: 'Vitello tonnato', foodImage: "https://www.donnamoderna.com/content/uploads/2014/08/vitello-tonnato-arrosto-830x625.jpg" },
    { foodName: 'Fesa di tacchino marinata con olive', foodImage: "https://images.unsplash.com/photo-1555178897-7774373fbe9e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80" }
  ];

  secondCard = [
    { foodName: 'Carpaccio di polpo', foodImage: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80" },
    { foodName: 'Cozze al verde', foodImage: "https://images.pexels.com/photos/3649208/pexels-photo-3649208.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260" },
    { foodName: 'Cocktail di gamberi', foodImage: "https://images.unsplash.com/photo-1605209918106-39492bee031d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { foodName: 'Risotto alla crema di scampi', foodImage: "https://images.unsplash.com/photo-1609770424775-39ec362f2d94?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80" },
    { foodName: 'Ravioli di pesce con crema di scampi', foodImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
  ]

  thirdCard = [
    { foodName: 'Parmigiana di melanzane', foodImage: "https://images.unsplash.com/photo-1613478880841-0a856df5c713?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1353&q=80" },
    { foodName: 'Strudel con ricotta e spinaci', foodImage: "https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260" },
    { foodName: 'Polpette di spinaci e ricotta', foodImage: "https://images.unsplash.com/photo-1529042410759-befb1204b468?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80" },
    { foodName: 'Frittata di patate al forno', foodImage: "https://images.unsplash.com/photo-1591985666643-1ecc67616216?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80" },
    { foodName: 'Spaghetti vegetariane', foodImage: "https://images.unsplash.com/photo-1516685018646-549198525c1b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
  ]


  constructor(private service: CartServiceService) {

      this.service.homePageIsActive.next(true);
  }

  ngOnInit(): void {
   /*  setTimeout(this.closeErrorMessage, 2000); */

    this.service.darkModeSwitcher.subscribe(
      (darkMode) => { this.darkMode = darkMode },
      (err) => { console.log(err) },
      () => { },
    )
  }

  //for menu cards
  printFirstCardPic(data) {
    this.firstCardActualImg = data;
  }

  printSecondCardPic(data) {
    this.secondCardActualImg = data;
  }

  printThirdCardPic(data) {
    this.thirdCardActualImg = data;
  }

  closeErrorMessage = () => {
    (document.querySelectorAll('.agm-map-container-inner')[0].lastElementChild as HTMLElement).style.display = 'none';
  }

}
