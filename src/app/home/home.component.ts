import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authservice.service';
import { dbService } from '../db.service';
import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { SeoSocialShareData, SeoSocialShareService } from 'ngx-seo';
import { PageService } from 'ngx-seo-page';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  cardCreated: boolean = false;
  stateLoading: boolean = true;
  target: any;


  constructor(private authService: AuthService, private dbService: dbService, private firebaseAuth: AngularFireAuth, private route: Router, private pageService: PageService) {
    this.target = document.querySelector('body');
    firebaseAuth.authState.subscribe(user => {
      this.user = user;
      if (this.user) {
        disableBodyScroll(this.target)
        this.getUserInfo(user);
        this.stateLoading = false;
        enableBodyScroll(this.target)
      }
      else {
        this.stateLoading = false;

      }
      // console.log(target);

    });

  }

  ngOnInit(): void {

  }



  getUserInfo(user: any) {
    this.dbService.getUserInfo(user.uid).subscribe(res => {
      let userDataRes: any = res.data();
      this.cardCreated = userDataRes.cardCreated;
    })

  }





  createCard() {
    this.route.navigateByUrl("/cardCreate")
  }

  goToCard() {
    this.route.navigateByUrl(`/cardView/${this.user.uid}`);
  }

}
