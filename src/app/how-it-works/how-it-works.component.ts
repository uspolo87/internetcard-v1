import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../authservice.service';
import { dbService } from '../db.service';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {
  user: any = {};
  stateLoading: boolean = true;
  cardCreated: boolean = false;
  constructor(private myElement: ElementRef, private authService: AuthService, private firebaseAuth: AngularFireAuth, private dbService: dbService,private router: Router, ) {
    firebaseAuth.authState.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.getUserInfo(user);
        this.stateLoading = false;
      }
      else {
        this.stateLoading = false;
      }
    });
  }


  getUserInfo(user: any) {
    this.dbService.getUserInfo(user.uid).subscribe(res => {
      let userDataRes: any = res.data();
      this.cardCreated = userDataRes.cardCreated;
    })

  }

  goToStep(step: any) {
    let el = this.myElement.nativeElement.querySelector(`#step-${step}`);
    el.scrollIntoView({ behavior: "smooth", block: "center" })

  }


  goToCard() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/cardView/${this.user.uid}`])
    );

    window.open(url, '_self');

  }
  goToCardInit() {
    this.router.navigateByUrl(`/cardCreate`);
  }
  

  ngOnInit(): void {
  }

}
