import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../authservice.service';
import { dbService } from "../db.service";
import { NotifierService } from 'angular-notifier';


import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-savedcards',
  templateUrl: './savedcards.component.html',
  styleUrls: ['./savedcards.component.css']
})
export class SavedcardsComponent implements OnInit {

  user: any;
  savedCards: any;
  private readonly notifier: NotifierService;


  constructor(private dbService: dbService, private route: ActivatedRoute, private router: Router, private notifierService: NotifierService, private firebaseAuth: AngularFireAuth, public dialog: MatDialog) {
    firebaseAuth.authState.subscribe(user => {
      this.user = user;
      if (user) {
        this.getSavedCards()
      }

    });

    this.notifier = notifierService;
  }

  ngOnInit(): void {


  }



  goToCard(cardId: string) {
    //this.router.navigateByUrl(`/cardView/${id}`);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/cardView/${cardId}`])
    );

    window.open(url, '_blank');

  }
  deleteCard(cardId: string) {
    this.dbService.deleteSavedCards(this.user.uid, cardId).then(res => {
      this.notifier.notify('danger', "card deleted successfully");
    }).catch(err => {
      this.notifier.notify('danger', err.code);
    })

  }

  getSavedCards() {
    this.dbService.getSavedCards(this.user.uid).subscribe(res => {
      this.savedCards = res;
    })
  }

}
