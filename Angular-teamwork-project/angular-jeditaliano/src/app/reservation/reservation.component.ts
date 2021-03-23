import { Component, OnInit } from '@angular/core';
import { CartServiceService } from '../service/cart-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  reservationForm: FormGroup;
  tableSize = [1, 2, 3, 4, 5, 6, 7, 8];
  reservationTime = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
  timeInValue = [12.00, 12.5, 13.00, 13.5, 14.00, 14.5, 15.00, 15.5, 16.00, 16.5, 17.00, 17.5, 18.00, 18.5, 19.00, 19.5, 20.00, 20.5, 21.00, 21.5]
  tables = [
    { tableId: 'table1', size: 4 },
    { tableId: 'table2', size: 6 },
    { tableId: 'table3', size: 5 },
    { tableId: 'table4', size: 8 },
    { tableId: 'table5', size: 4 }
  ]


  //USER EMAIL

  loggedInUserEmail: string = "";
  //foglalt asztalok id
  currentFalseStatus = "";

  constructor(private cartService: CartServiceService, private firestore: AngularFirestore) {
    this.getTableStatus();
    this.getActiveReservations();
    this.cartService.homePageIsActive.next(false);
    //this.getTableTimeValueStatus();                                                                        FEJLESZTÉS ALATT     

    this.reservationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[\d]{5,15}$/)]),
      size: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    // bejelentkezett felhasználó adatainak automatikus kitöltése
    this.loggedInUserEmail = this.cartService.getLocalStorageDetails();

    if (this.loggedInUserEmail) {
      const resp = this.firestore.collection('users', ref => ref.where('email', '==', this.loggedInUserEmail));

      resp.get().subscribe(
        (data) => {
          data.forEach((user: any) => {
            this.reservationForm.get('name').setValue(user.data().name);
            this.reservationForm.get('email').setValue(user.data().email);
          })
        },
        (err) => { console.log(err) },
      );
    }

    this.cartService.getLocalStorageDetails();

  }

  isBigEnought = () => {
    const guests = this.reservationForm.controls['size'].value;
    let goodTablesId = [];
    let badTablesId = [];

    for (let table of this.tables) {
      //létszám hasonlítás+állapot + valtozoba szortirozas
      if (table.size >= guests && !this.currentFalseStatus.includes(table.tableId)) {
        goodTablesId.push(table.tableId)
      } else {
        badTablesId.push(table.tableId)
      }
    }
    //jó asztalok zöldre festése...
    for (let tables of goodTablesId) {
      document.getElementById(tables).style.backgroundColor = 'rgba(30, 255, 0, 0.548)';
      document.getElementById(tables).style.cursor = "pointer";
      document.getElementById(tables).removeAttribute("disabled")
    }
    //rossz asztalok pirosra festése...
    for (let tables of badTablesId) {
      document.getElementById(tables).style.backgroundColor = 'rgba(255, 0, 0, 0.698)';
      document.getElementById(tables).setAttribute("disabled", "disabled");
      document.getElementById(tables).style.cursor = "not-allowed";
    }
  }

  // isAtGoodTime = () => {
  //   const requiredTime = this.reservationForm.controls['time'].value;                                      
  //   console.log(requiredTime);
  // }

  // //asztal kijelölés 
  setTableBorder = (id: string) => {
    this.buttonClicked = id;

    for (let table of this.tables) {
      document.getElementById(table.tableId).style.border = "none"
    }

    for (let table of this.tables) {
      if (table.tableId === id) {
        document.getElementById(id).style.border = "solid 2px yellow";
      }
    }
  }

  //----------------------------------------------------------------------------CRUD-------------------------------------------------------------------------------//
  //button id, CRUD-hoz kell, asztal katt után kapja
  buttonClicked: string
  //make reservation gomb

  saveReservation = () => {
    const reservation = this.reservationForm.value;

    reservation.tableId = this.buttonClicked;
    reservation.time = document.getElementById('timeInput').innerText;

    //foglalás idő-hosszának összerakása
    const inputTime = this.reservationForm.controls['time'].value;
    const timesToBlock = [];
    timesToBlock.push(+inputTime);
    timesToBlock.push(+inputTime + 1);
    timesToBlock.push(+inputTime + 0.5)
    //--
    reservation.timeValue = inputTime;

    //this.reservedTimeBooleanChange(timesToBlock, reservation.tableId)                                        FEJLESZTÉS ALATT
    this.sendReservation(reservation);
    this.updateTableStatus(this.buttonClicked)
  }

  //foglalási időtartam update to false
  //reservedTimeBooleanChange = (timesToBlock: any, tableId: string) => {
  //console.log(timesToBlock);
  //console.log(tableId);
  // for (let time of timesToBlock) {
  //   this.firestore.collection('tables').doc(tableId)
  //     .set({ [time]: false }, { merge: true })
  //     .then(() => console.log('Time Status Updated'))
  // }
  // const resp = this.firestore.collection('tables').doc('timeValue');                                        FEJLESZTÉS ALATT
  // const listOfTables = [];

  // resp.snapshotChanges().subscribe(
  //   (timeValue) => {

  //   },
  //   (err) => console.log(err),
  //   () => {}
  // )

  //}


  //foglalás adatainak küldése
  sendReservation = (reservation: any) => {
    const response = this.firestore.collection('foglalasok').add(reservation);

    response
      .then((data) => {
      })
      .catch(err => console.log(err))
  }
  //asztal státuszának módosítása
  updateTableStatus = (tableId: any) => {
    let tableToUpdate = tableId;
    this.firestore.collection('tables').doc(tableToUpdate)
      .set({ isActive: false }, { merge: true })
      .then(() => console.log())
      .then(() => {
        //urlap kiüritese
        this.reservationForm.reset();
      }
      )
  }

  //--------------------------------asztalok isactive státuszának lekérése 


  getTableStatus = () => {
    const currentTableStatus = this.firestore.collection('tables', ref => ref.where('isActive', '==', false));
    currentTableStatus.get().subscribe(
      (datas) => {
        datas.forEach((data) => {
          this.readActiveFalseId(data.data());
        })
      },
      (err) => console.log(err),
     
    )
  }

  readActiveFalseId = (obj: any) => {
    this.currentFalseStatus = this.currentFalseStatus + ', ' + obj.id;
    //console.log(this.currentFalseStatus)
  }

  //-----------------------------------foglalások lekérése + törölt foglalás után asztal státusz visszaállítása +valid idő/asztal lekérdezése
  currentReservationsTableId = [];

  //foglalt asztalok + idők
  // curentTimeOnTable1 = [];                                                                         FEJLESZTÉS ALATT
  // curentTimeOnTable2 = [];
  // curentTimeOnTable3 = [];
  // curentTimeOnTable4 = [];
  // curentTimeOnTable5 = [];


  getActiveReservations = () => {
    const reservations = this.firestore.collection('foglalasok');

    reservations.get().subscribe(
      (datas) => {
        datas.forEach((data: any) => { //any-vel elérem közvetlen az idt
          this.currentReservationsTableId.push(data.data().tableId);
          
          //   let key = data.data().tableId;                                                           FEJLESZTÉS ALATT

          //   // //időtartam
          //   let time = data.data().timeValue;

          //   if (key === 'table1') {
          //     this.curentTimeOnTable1.push(+time);
          //     this.curentTimeOnTable1.push(+time + 0.5);
          //     this.curentTimeOnTable1.push(+time + 1);
          //   }
          //   if (key === 'table2') {
          //     this.curentTimeOnTable2.push(+time);
          //     this.curentTimeOnTable2.push(+time + 0.5);
          //     this.curentTimeOnTable2.push(+time + 1);
          //   }
          //   if (key === 'table3') {
          //     this.curentTimeOnTable3.push(+time);
          //     this.curentTimeOnTable3.push(+time + 0.5);
          //     this.curentTimeOnTable3.push(+time + 1);
          //   }
          //   if (key === 'table4') {
          //     this.curentTimeOnTable4.push(+time);
          //     this.curentTimeOnTable4.push(+time + 0.5);
          //     this.curentTimeOnTable4.push(+time + 1);
          //   }
          //   if (key === 'table5') {
          //     this.curentTimeOnTable5.push(+time);
          //     this.curentTimeOnTable5.push(+time + 0.5);
          //     this.curentTimeOnTable5.push(+time + 1);
          //   }

          //   console.log(this.curentTimeOnTable1);
          //   console.log(this.curentTimeOnTable2);
          //   console.log(this.curentTimeOnTable3);
          //   console.log(this.curentTimeOnTable4);
          //   console.log(this.curentTimeOnTable5);

        })
      },
      (err) => console.log(err),
      () => { this.afterDeletedReservationStatusRestore() }

    )
  }


afterDeletedReservationStatusRestore = () => {
  let tableToRestore = [];

  for (let table of this.tables) {
    if (!this.currentReservationsTableId.includes(table.tableId)) {
      tableToRestore.push(table.tableId);
    }
  }
  for (let freeTable of tableToRestore) {
    this.firestore.collection('tables').doc(freeTable)
      .set({ isActive: true }, { merge: true })
      .then(() => console.log())
  }
}

  //-----------asztalok időpontstátuszának lekerese                                                               FEJLESZTÉS ALATT
  // getTableTimeValueStatus = () =>{
  //   for(let time of this.timeInValue){
  //   //const resp = this.firestore.collection('tables').doc([time.toString()])
  // }
  // }
  // //-----------asztalok idopontstatuszanak visszaállítása
  //   afterDeleteRestoreTheTimeValue = () => {

  //   }
  //}

}
