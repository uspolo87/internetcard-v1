import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../authservice.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { SearchService } from '../search.service';
import { dbService } from '../db.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  hideNavbar: boolean = false;
  stateLoading: boolean = false;
  event$: any;
  user: any;
  currentUserCard: boolean = false;

  showSearch: boolean = false;
  cardCreated: boolean = false;
  navShowHide: boolean = false;
  hideCardViewBtn: boolean = false;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private route: Router,
    private ref: ChangeDetectorRef,
    public authService: AuthService,
    private dbService: dbService,
    private firebaseAuth: AngularFireAuth
  ) {
    firebaseAuth.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        localStorage.setItem('userId', user.uid);

        if (
          window.location.href.includes(user.uid) &&
          window.location.href.includes('cardView')
        ) {
          this.hideCardViewBtn = true;
        }

        this.getUserInfo(user);
      }
    });
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // console.log(event.url)
        if (
          event.url === '/login' ||
          event.url === '/terms' ||
          event.url === '/privacy' ||
          event.url.includes('ipl2022')
        ) {
          this.hideNavbarFunc();
        } else {
          this.showNavbarFunc();
          this.ToggleNavBar();
        }

        let userId = this.user ? this.user.uid : localStorage.getItem('userId');
        if (
          window.location.href.includes(userId) &&
          event.url.includes('cardView')
        ) {
          this.hideCardViewBtn = true;
        } else {
          this.hideCardViewBtn = false;
        }

        if (event.url.includes('cardView')) {
          this.showSearch = true;
        } else {
          this.showSearch = false;
        }
      }
    });
  }

  ToggleNavBar() {
    if (window.innerWidth < 767) {
      let element: HTMLElement = document.getElementsByClassName(
        'navbar-toggler'
      )[0] as HTMLElement;
      if (element.getAttribute('aria-expanded') == 'true') {
        element.click();
      }
    }
  }

  goToCard() {
    //console.log("class")
    //this.route.navigateByUrl(`/cardView/${this.user.uid}`);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/cardView/${this.user.uid}`])
    );

    window.open(url, '_self');
  }
  goToCardInit() {
    this.route.navigateByUrl(`/cardCreate`);
  }

  getUserInfo(user: any) {
    //("user")

    this.dbService.getUserInfo(user.uid).subscribe((res) => {
      let userDataRes: any = res.data();
      this.cardCreated = userDataRes.cardCreated;
    });
  }

  navStatus(ele: string) {
    if (ele === 'menu') {
      this.navShowHide = !this.navShowHide;
    } else {
      this.navShowHide = true;
    }
  }

  hideNavbarFunc() {
    this.hideNavbar = true;
    this.ref.markForCheck();
  }
  showNavbarFunc() {
    this.hideNavbar = false;
    this.ref.markForCheck();
  }

  userLogout() {
    this.stateLoading = true;
    //console.log("called");
    this.authService.logout().then((res) => {
      this.router.navigateByUrl('/login');
    });
    this.stateLoading = false;
  }

  sendInputData(key: string) {
    this.searchService.updateData(key);
  }
}
