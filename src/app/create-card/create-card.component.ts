import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../authservice.service';
import { dbService } from '../db.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css'],
})
export class CreateCardComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currentStep: number = 1;
  selectedIcon: string = 'facebook';
  fileToUpload: any;
  message: string | undefined;
  imageURL: any;
  cardBg: string = 'false';
  cardBgColor: any;
  card: any = {
    userProfession: 'student',
    socialLinks: {},
    userGender: 'gender',
    userCountry: 'India',
  };
  userName: string = '';
  cardType: any;
  skillSearch: any;
  skillsArray: any = [];
  customLinks: any = [
    { title: '', url: '' },
    { title: '', url: '' },
    { title: '', url: '' },
  ];
  selectedAvatar: any;
  remaingLinksCount: number = 0;
  userBioLength: number = 0;
  user: any;
  stateLoading: boolean = true;
  cardId: any;
  private readonly notifier: NotifierService;
  showEmpInput: boolean = false;
  bussinessBioLength: any = 0;
  fileToReturn: any;
  data: any;
  filePath: any = '';
  downloadURL: any;
  businessProfileImage: any;
  imageUrl: string = '';
  countryList: any;
  innerWidth: number = 0;
  createStatus: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dbService: dbService,
    private firebaseAuth: AngularFireAuth,
    private authService: AuthService,
    private notifierService: NotifierService,
    private storage: AngularFireStorage
  ) {
    this.notifier = notifierService;
    firebaseAuth.authState.subscribe((user) => {
      //console.log(user);
      if (user) {
        this.user = user;
        this.fetchCardDetails(this.cardId);
      } else {
        this.user = null;
      }
    });
  }

  getUserBioLength() {
    this.userBioLength = this.card.userBio.length;
  }
  getbussinessBioLength() {
    this.bussinessBioLength = this.card.businessBio.length;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.card.businessLogo = '';
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    let file = base64ToFile(this.croppedImage);

    var blob = new Blob([file], { type: 'image/png' });
    this.businessProfileImage = new File(
      [blob],
      `businessProfile-${this.user.uid}`
    );
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  setCardbg(color: any) {
    //this.cardBgColor = color;
    this.card.bgColor = color;
  }

  addSkill($event: Event, skillSearch: string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.skillSearch = '';
    if (!skillSearch) {
      this.notifier.notify('warning', 'Skill cannot be empty');
      return;
    }
    this.skillsArray.push(skillSearch);
  }

  detelSkill(skill: string) {
    this.skillsArray.splice(this.skillsArray.indexOf(skill), 1);
  }

  choseAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.card.avatar = avatar;
  }

  uploadCv() {
    this.stateLoading = true;
    this.storage
      .upload(`resume/${this.user.uid}`, this.filePath)
      .then((res) => {
        res.ref.getDownloadURL().then((url) => {
          this.card.resumeUrl = url;
          this.stateLoading = false;
          this.notifier.notify('success', 'Resume uploaded successfully');
        });
      })
      .catch((err) => {
        this.notifier.notify('error', err.code);
      });
  }

  uploadBusinessProfilePicture() {
    this.stateLoading = true;
    this.storage
      .upload(`businessLogo/${this.user.uid}`, this.businessProfileImage)
      .then((res) => {
        res.ref.getDownloadURL().then((url) => {
          this.card.businessLogo = url;
          this.stateLoading = false;
          this.notifier.notify('success', 'Logo uploaded successfully');
        });
      })
      .catch((err) => {
        this.notifier.notify('error', err.code);
        this.stateLoading = false;
      });
  }

  updateUserBasicInfo() {
    let userBasicDetails = {
      avatar: this.card.avatar || '',
      name: this.card.userName || '',
      search: '',
      cardCreated: true,
      cardType: this.card.cardType,
    };
    if (this.cardType === 'business') {
      userBasicDetails.name = this.card.businessName;
      userBasicDetails.avatar = this.card.businessLogo;
      userBasicDetails.search = this.card.businessName.toLowerCase().split(' ');
    } else {
      userBasicDetails.search =
        this.card.userName.toLowerCase().split(' ') || '';
    }
    this.dbService.saveUserInfo(this.user.uid, userBasicDetails).then((res) => {
      this.dbService.updateCardStatus(this.user.uid);
    });
  }

  async createCard() {
    this.stateLoading = true;
    this.updateUserBasicInfo();

    this.card.skillsArray = this.skillsArray;
    this.card.customLinksArray = this.customLinks;

    this.dbService
      .createCard(this.card, this.user.uid)
      .then((res) => {
        this.notifier.notify('success', 'Internet Card updated successfully!');
        // this.router.navigate([`/cardView/${this.user.uid}`]);
        const url = this.router.serializeUrl(
          this.router.createUrlTree([`/cardView/${this.user.uid}`])
        );
        window.open(url, '_self');
        this.stateLoading = false;
      })
      .catch((err) => {
        this.stateLoading = false;
        console.log(err);
      });
  }

  getCountryList() {
    this.dbService.getCountryList().subscribe((res) => {
      this.countryList = res;
    });
  }

  getCv($event: any) {
    this.filePath = $event.target.files[0];
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  userType(type: string) {
    if (type === 'employee') {
      this.showEmpInput = true;
    } else {
      this.showEmpInput = false;
    }
  }

  showStep(step: number) {
    if (this.cardType === 'personal') {
      if (step === 2) {
        if (!this.card.avatar) {
          this.notifier.notify('error', 'Please choose avatar');
          return;
        }
      } else if (step === 3) {
        if (
          !this.card.userName ||
          !this.card.userContact ||
          !this.card.gmail ||
          !this.card.userCountry ||
          !this.card.userGender ||
          !this.card.userDob
        ) {
          this.notifier.notify('error', 'Please fill all the details');
          return;
        }
      }
      if (step === 4) {
        // const length = Object.keys(this.card.socialLinks).length;
        // if (length) {
        //   this.notifier.notify('error', 'Please fill at least 4 links');
        //   return;
        // }
      } else if (step === 5) {
        if (this.card.userProfession === 'student') {
          if (
            !this.card.userBio ||
            !this.card.userInstitute ||
            this.skillsArray.length === 0
          ) {
            this.notifier.notify('error', 'Please fill all the details');
            return;
          }
        } else if (
          !this.card.userBio ||
          !this.card.userCompany ||
          !this.card.resumeUrl
        ) {
          this.notifier.notify(
            'error',
            'Please fill all the details/upload CV'
          );
          return;
        }
      }
    } else if (this.cardType === 'business') {
      if (step === 2) {
        if (
          !this.card.businessName ||
          !this.card.businessContact ||
          !this.card.businessEmail ||
          !this.card.businessCountry ||
          !this.card.businessCity
        ) {
          this.notifier.notify('error', 'Please fill all the details');
          return;
        }
      } else if (step === 3) {
        const length = Object.keys(this.card.socialLinks).length;
        if (length < 4) {
          this.notifier.notify('error', 'Please fill at least 4 links');
          return;
        }
      } else if (step === 4) {
        if (!this.card.businessBio || this.skillsArray.length === 0) {
          this.notifier.notify('error', 'Please fill services/logo');
          return;
        }
        //this.uploadBusinessProfilePicture();
      }
    }
    this.currentStep = step;

    if (step === 5 || step === 4) {
      this.remaingLinksCount = Object.keys(this.card.socialLinks).length - 5;
    }
  }

  fetchCardDetails(cardId: string) {
    if (!cardId && this.createStatus !== 'new') {
      this.stateLoading = false;
      this.notifier.notify('error', 'Card id is missing');
      return;
    }

    if (this.user.uid !== this.cardId && this.createStatus !== 'new') {
      this.notifier.notify('error', 'You are not authorized to this action');
      this.router.navigateByUrl('/home');
      return;
    }

    if (cardId) {
      this.dbService.getCardData(cardId).subscribe((res) => {
        this.card = res.data();
        if (this.card.cardType === 'business') {
          this.bussinessBioLength = this.card.businessBio.length;
        } else {
          this.userBioLength = this.card.userBio.length;
        }
        //
        this.imageUrl = this.card.businessLogo;
        this.selectedAvatar = this.card.avatar;
        this.skillsArray = this.card.skillsArray;
        this.stateLoading = false;
      });
    } else {
      this.stateLoading = false;
    }
  }

  ngOnInit(): void {
    this.stateLoading = true;
    this.innerWidth = window.innerWidth;

    this.route.queryParams.subscribe((params) => {
      this.cardType = params['cardType'];
      this.createStatus = params['status'];
      this.card.cardType = this.cardType;
    });

    if (this.cardType === 'business') {
      this.card.businessType = '';
      this.card.businessCountry = 'India';
    }

    this.cardId = this.route.snapshot.paramMap.get('cardId');

    this.getCountryList();
  }
}
