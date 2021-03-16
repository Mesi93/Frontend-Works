import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

//Import Reactive forms
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';

//Import Firebase
import { AngularFireModule } from '@angular/fire'
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFireAuthModule } from '@angular/fire/auth';



//constructor-ban erre kell hivatkozni adatbázisnál
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore'
//^ csak ez

import { environment } from'../environments/environment'

//Import Router
import { AppRoutingModule } from './app-routing.module';

//Import Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { from } from 'rxjs';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { ReservationComponent } from './reservation/reservation.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    MenuComponent,
    RegisterComponent,
    CartComponent,
    UserAccountComponent,
    ReservationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDcTnjscbQi2tpXzF4t97rQxay5RQJ5U-k'
    }),
    ReactiveFormsModule,
    //Enviroment ts-ben a firebase config fájl
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
   

    ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
