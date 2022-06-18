import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { dbService } from '../db.service';
import { SearchService } from '../search.service';

import { NotifierOptions, NotifierService } from 'angular-notifier';
import { Meta } from '@angular/platform-browser';

import { ShareService } from '../share.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IplthemeComponent } from '../specialEvents/ipltheme/ipltheme.component';
import { CreateCardComponent } from '../create-card/create-card.component';

// import { QrCodeModule } from 'ng-qrcode';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
})
export class CardViewComponent implements OnInit {
  cardId: any;
  cardData: any = '';
  remaingLinksCount: any;
  stateLoading: boolean = true;
  myData: any;
  showSearchUI: boolean = false;
  showMoreLinks: boolean = false;
  searchResults: any = [];
  user: any;
  linkCount: number = 3;
  private readonly notifier: NotifierService;
  showLike: boolean = false;
  likesLength: any;
  showSavedCard: boolean = false;
  locationUrl: string = '';

  qrImageUrl: string = '';
  flipCardSide: boolean = false;

  showFeedbackTextarea: boolean = false;

  feedbackData: any = {
    action: '',
    message: '',
    userId: '',
    email: '',
    name: '',
  };

  @Input('cardActions') cardActions!: boolean;
  @Input('mode') mode!: string;
  @Input('selectedTeam') selectedTeam!: string;

  @ViewChild('iplContent', { static: true })
  public iplContent!: TemplateRef<any>;

  constructor(
    private shareService: ShareService,
    private dbService: dbService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private firebaseAuth: AngularFireAuth,
    private notifierService: NotifierService,
    private modalService: NgbModal
  ) {
    firebaseAuth.authState.subscribe((user) => {
      //console.log(user);
      this.user = user;
      if (user) {
        this.fetchLikeData();
        this.fetchSavedCards();
      } else {
        this.user = null;
      }
    });
    this.notifier = notifierService;
  }

  // remove the inline styles for ipl theme

  removeInlineStyles(selectedTeam: string) {
    if (this.cardData.selectedIplTeam || selectedTeam) {
      document.querySelector('#personal-card-bg')?.removeAttribute('style');
      document
        .querySelector('.mini-card-header.bg-color')
        ?.removeAttribute('style');
    }
    document.querySelector('.mini-card-body')?.removeAttribute('style');
  }

  updateCard(selectedIplTeam: string) {
    this.cardData.selectedIplTeam = selectedIplTeam;
    if (selectedIplTeam) {
      this.cardData.bgColor = '';
    }
    this.dbService
      .createCard(this.cardData, this.user.uid)
      .then((res) => {
        this.notifier.notify(
          'success',
          'Your Internet Card updated successfully!'
        );
        this.router.navigate([`/cardView/${this.user.uid}`]);
        this.stateLoading = false;
      })
      .catch((err) => {
        this.stateLoading = false;
        console.log(err);
      });
  }

  openLg(content: any) {
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  openIPlModal() {
    this.modalService.open(this.iplContent, { size: 'xl', centered: true });
  }

  updateLinkCount() {
    this.linkCount = this.cardData.socialLinks.length;
    this.showMoreLinks = true;
  }

  registerFeedbackAction(action: string) {
    this.feedbackData.action = action;
    this.showFeedbackTextarea = true;
  }

  registerFeedback(message: string) {
    this.feedbackData.name = this.cardData.userName;
    (this.feedbackData.email = this.user.email),
      (this.feedbackData.userId = this.user.uid);
    this.feedbackData.message = message;
    this.dbService.feedback(this.feedbackData).then((res) => {
      this.modalService.dismissAll();
      this.showFeedbackTextarea = false;
      this.notifier.notify('success', 'Thanks for your valuble feedback');
    });
  }

  flipCard() {
    this.flipCardSide = !this.flipCardSide;
  }

  addToSavedCard(
    cardName: string,
    cardAvatar: string,
    cardId: string,
    cardType: string
  ) {
    let savedCardDetails = {
      name: cardName,
      avatar: cardAvatar,
      id: cardId,
      type: cardType,
    };
    console.table(savedCardDetails);
    this.stateLoading = true;
    // console.log(savedCardDetails);
    this.dbService
      .addToSavedCards(this.user.uid, savedCardDetails, cardId)
      .then((res) => {
        this.stateLoading = false;
        this.notifier.notify('success', 'Card saved succesfully');
      });
  }

  likeThisCard(
    cardName: string,
    cardAvatar: string,
    cardId: string,
    cardType: string
  ) {
    this.showLike = !this.showLike;
    let savedCardDetails = {
      name: cardName,
      avatar: cardAvatar,
      id: cardId,
      type: cardType,
    };
    //console.table(savedCardDetails);

    this.dbService
      .likeCard(this.user.uid, savedCardDetails, cardId)
      .then((res) => {
        this.dbService.updateLike(this.user.uid, cardId).then((res) => {
          this.dbService
            .updateLike(this.user.uid, cardId)
            .then((res) => {
              this.fetchCardDetails(this.cardId);
            })
            .catch((err) => {
              this.showLike = this.showLike;
              this.notifier.notify(
                'error',
                'unable to like the card, please try again'
              );
              console.log(err);
            });
        });
      });
  }

  unLikeThisCard(cardId: string) {
    this.showLike = !this.showLike;
    this.dbService
      .unlikeCard(this.user.uid, cardId)
      .then((res) => {
        this.dbService.decreaseLike(this.user.uid, cardId).then((res) => {
          this.fetchCardDetails(this.cardId);
        });
      })
      .catch((err) => {
        this.showLike = this.showLike;
      });
  }

  fetchCardDetails(cardId: string) {
    this.dbService.getCardData(cardId).subscribe((res) => {
      this.cardData = res.data();
      console.log(this.cardData);
      if (this.cardData) {
        if (this.cardData.selectedIplTeam) {
          this.selectedTeam = this.cardData.selectedIplTeam;
          this.removeInlineStyles(this.selectedTeam);
        }
        // if (
        //   this.mode != 'preview' &&
        //   !this.selectedTeam &&
        //   window.innerWidth < 767
        // ) {
        //   this.openIPlModal();
        // }

        if (this.cardData.likes) {
          let likesObj = this.cardData.likes;
          this.likesLength = Object.keys(likesObj).length;
        }
        if (!this.cardData) {
          this.stateLoading = false;
          return;
        }

        this.showSearchUI = false;
        this.remaingLinksCount =
          Object.keys(this.cardData.socialLinks).length - 3;
        this.stateLoading = false;

        this.shareService.setFacebookTags(
          window.location.href,
          `Hey I am ${this.cardData.userName}, checkout my internet card here`,
          'Internet card lets you to mange and share all the business and personal social media links at one place.'
        );

        this.shareService.setTwitter(
          window.location.href,
          `Hey I am ${this.cardData.userName}, checkout my internet card here`,
          'Internet card lets you to mange and share all the business and personal social media links at one place.'
        );
      } else {
        this.stateLoading = false;
      }
    });
  }

  goToCardEdit() {
    this.router.navigateByUrl(
      `/card/edit/${this.cardId}?cardType=${this.cardData.cardType}`
    );
  }

  goToCard(id: string) {
    //this.router.navigateByUrl(`/cardView/${id}`);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/cardView/${id}`])
    );

    window.open(url, '_blank');
  }

  goToSavedCards() {
    this.router.navigateByUrl(`/savedCards/${this.user.uid}`);
  }

  fetchLikeData() {
    this.dbService.getUserLikesInfo(this.user.uid).subscribe((res) => {
      res.forEach((card) => {
        if (card.id === this.cardId) {
          this.showLike = true;
        }
      });
    });
  }

  fetchSavedCards() {
    this.dbService.getSavedCardsInfo(this.user.uid).subscribe((res) => {
      res.forEach((card) => {
        if (card.id === this.cardId) {
          this.showSavedCard = true;
        }
      });
    });
  }

  copyToClipboard() {
    let selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';

    if (this.cardData.cardType === 'business') {
      selBox.value = `Hey I am ${this.cardData.businessName}, checkout my internet card here ${this.locationUrl}`;
    } else {
      selBox.value = `Hey I am ${this.cardData.userName}, checkout my internet card here ${this.locationUrl}`;
    }

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifier.notify(
      'success',
      'Card url is copied to clipboard successfully'
    );
  }

  async shareCard() {
    const shareData = {
      title: `Internetcard`,
      text: `Hi I am ${this.cardData.userName}.Check out my internet card here.`,
      url: window.location.href,
    };

    navigator.share(shareData);
  }

  redirectToIplTheme() {
    this.router.navigateByUrl(
      `/ipl2022/${this.user.uid}?selectedTeam=${this.selectedTeam}`
    );
    this.modalService.dismissAll();
  }

  ngOnInit(): void {
    this.locationUrl = window.location.href;

    this.cardId = this.route.params.subscribe((params) => {
      let cardId = params['cardId'];
      if (cardId) {
        this.fetchCardDetails(cardId);
      }
    });

    this.cardId = this.route.snapshot.paramMap.get('cardId');
    if (this.cardId) {
      this.fetchCardDetails(this.cardId);
    } else {
      //do somthing
    }

    this.searchService.getData().subscribe((data) => {
      this.myData = data;
      if (data) {
        this.showSearchUI = true;
        this.stateLoading = true;
        this.dbService
          .searchCards(this.myData.toLowerCase())
          .subscribe((res) => {
            this.searchResults = res;
            this.stateLoading = false;
          });
      } else {
        this.stateLoading = false;
        this.showSearchUI = false;
      }
    });
  }
}
