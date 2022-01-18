import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../authservice.service';
import { dbService } from '../db.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loadingState: boolean = false;
  formError: string | undefined;
  userPassword: string | undefined;
  showPassword: boolean = false;
  showLogin: boolean = true;
  showSignup: boolean = false;
  showForgotBlock: boolean = false;
  signUpFormError: string | undefined;
  user: any = {};
  private readonly notifier: NotifierService;
  cardCreated: boolean = false;
  stateLoading: boolean = false;
  passwordMailSent: boolean = false;



  constructor(private authService: AuthService, private router: Router, private dbService: dbService, private notifierService: NotifierService) {
    this.notifier = notifierService;
  }



  loginWithCredentials(userCredentials: any) {
    if (userCredentials.value.userName === "" || userCredentials.value.password === "") {
      this.notifier.notify('error', "please enter email/password");
      return;
    }
    this.loadingState = true;
    this.stateLoading = true;



    this.authService.login(userCredentials.value.userName, userCredentials.value.userPasssword).then(res => {
      this.user = res.user;
      this.getUserInfo(this.user);
    }).catch(err => {
      this.stateLoading = false;
      this.notifier.notify('error', err.code);
    })
  }

  getUserInfo(user: any) {
    this.dbService.getUserInfo(user.uid).subscribe(res => {

      if (res.data()) {
        let userDataRes: any = res.data();
        if (userDataRes.cardCreated) {
          this.cardCreated = userDataRes.cardCreated;
        }
      }
      if (this.cardCreated) {
        this.router.navigateByUrl(`/cardView/${this.user.uid}`)
      }
      else {
        let userDetailsObj = {
          cardCreated: false,
          cardId: user.uid,
          createdOn: new Date().getTime()
        }

        this.dbService.saveUserInfo(this.user.uid, userDetailsObj).then(res => {
          this.router.navigateByUrl("/cardCreate");
        })

      }
      this.stateLoading = false;
    })

  }

  signUpWithCredentails(signUpFormData: any) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (signUpFormData.value.userSignupName === "" || signUpFormData.value.userSignupPassword === "" || signUpFormData.value.userSignupConfirmPassword === "") {
      this.notifier.notify('error', 'please fill all the feilds');
      return;
    }
    if (!re.test(signUpFormData.value.userSignupPassword)) {
      this.notifier.notify('error', 'password should be min 8 letters, with at least a symbol, upper and lower case letters and a number');
      return;
    }
    if (signUpFormData.value.userSignupPassword !== signUpFormData.value.userSignupConfirmPassword) {
      this.signUpFormError = "your password doesn't match";
      return;
    }
    this.stateLoading = true;

    this.authService.signup(signUpFormData.value.userSignupName, signUpFormData.value.userSignupPassword).then(res => {
      this.stateLoading = false;
      this.notifier.notify('info', 'Welcome to Internet Cards');
      this.router.navigateByUrl("/cardCreate");
      this.loadingState = false;
      this.user = res.user;
    }).then(res => {
      let userDetailsObj = {
        cardCreated: false,
        cardId: this.user.uid,
        createdOn: new Date().getTime()
      }

      this.dbService.saveUserInfo(this.user.uid, userDetailsObj).then(res => {
        console.log(res);
      })

    }).catch(err => {
      //this.loadingState = false;
      this.stateLoading = false;
      this.notifier.notify('error', err.code);
      //this.formError = err.code;
    })
  }


  loginWithGoogle() {
    this.authService.loginWithGoogle().then(res => {
      this.user = res.user;
      this.getUserInfo(this.user);
    })
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().then(res => {
      this.user = res.user;
      this.getUserInfo(this.user);
    })
  }

  sendPasswordResetLink(formData: any) {
    this.authService.sendPasswordResetLink(formData.value.userPasswordResetemail).then((res) => {
      //this.formError = "a password reset link has been sent to your email..";
      this.notifier.notify('info', "a password reset link has been sent to your email..");
      this.passwordMailSent = true;

    }, (err) => {
      // this.formError = err;
      this.notifier.notify('error', err.code);
    })
  }




  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  showAuthContainer(container: string) {
    console.log(container)
    if (container === "login") {
      this.showLogin = true;
      this.showSignup = false;
      this.showForgotBlock = false;
    }
    else if (container === "signup") {
      this.showLogin = false;
      this.showSignup = true;
      this.showForgotBlock = false;
    }
    else if (container === "forgotBlock") {
      this.showLogin = false;
      this.showSignup = false;
      this.showForgotBlock = true;
    }
  }

  ngOnInit(): void {
    this.stateLoading = true;
    this.authService.userStatus().then(user => {
      if (user) {
        this.router.navigateByUrl("/home");
        this.stateLoading = false;
      }
      else {
        this.stateLoading = false;
      }
    })
  }

}
