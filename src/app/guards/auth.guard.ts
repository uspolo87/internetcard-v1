import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userStatus: any;
  constructor(private afAuth: AngularFireAuth) {

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const user = await this.afAuth.user;
    user.subscribe(res => {
      this.userStatus = res;
    })


    const isAutenticated = this.userStatus ? true : false;
    //console.log(isAutenticated, "guard");

    if (!isAutenticated) {
      console.log("please login")
    }
    return isAutenticated;
  }

}
