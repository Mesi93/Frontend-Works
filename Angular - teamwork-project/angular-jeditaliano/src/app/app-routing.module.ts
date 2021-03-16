import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { ReservationComponent } from './reservation/reservation.component';
import { UserAccountComponent } from './user-account/user-account.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "menu", component:MenuComponent},
  {path: "register", component: RegisterComponent},
  {path: "cart", component: CartComponent},
  {path: "account", component: UserAccountComponent},
  {path: "reservation", component: ReservationComponent},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
