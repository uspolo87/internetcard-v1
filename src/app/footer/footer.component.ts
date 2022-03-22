import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { dbService } from '../db.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  hideFooter: boolean = false;
  event$: any;
  private readonly notifier: NotifierService;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private dbService: dbService,
    private notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        //console.log(event.url)
        if (
          event.url === '/login' ||
          event.url.includes('ipl2022') ||
          event.url.includes('cardView') ||
          event.url.includes('cardCreate') ||
          event.url.includes('savedCards') ||
          event.url.includes('card/edit') ||
          event.url.includes('/terms') ||
          event.url.includes('/privacy')
        ) {
          this.hideFoooterFunc();
        } else {
          // console.log("else");
          this.showFoooterFunc();
        }
      }
    });
  }

  //save user query to database

  saveUserQuery(queryForm: any) {
    if (queryForm.value.email === '' || queryForm.value.message === '') {
      this.notifier.notify('warning', 'Please fill the email and message');
      return;
    }

    this.dbService.saveQuery(queryForm.value).then((res) => {
      queryForm.reset();
      this.notifier.notify(
        'success',
        'Thanks for your query, we will get back to you in 24 Hours'
      );
    });
  }

  hideFoooterFunc() {
    this.hideFooter = true;
    this.ref.markForCheck();
  }
  showFoooterFunc() {
    this.hideFooter = false;
    this.ref.markForCheck();
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
