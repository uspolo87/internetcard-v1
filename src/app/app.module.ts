import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CardViewComponent } from './card-view/card-view.component';
import { CreateCardComponent } from './create-card/create-card.component';

import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthService } from './authservice.service';
import { CardInitComponent } from './card-init/card-init.component';

// import third-party module
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';

import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SavedcardsComponent } from './savedcards/savedcards.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionServiceModule } from 'ng-connection-service';

import { NgxKjuaModule } from 'ngx-kjua';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularTiltModule } from 'angular-tilt';
import { OfflinePageComponent } from './offline-page/offline-page.component';
import { TocComponent } from './toc/toc.component';
import { TacComponent } from './tac/tac.component';
import { PrivacyComponent } from './privacy/privacy.component';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { IplthemeComponent } from './specialEvents/ipltheme/ipltheme.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HowItWorksComponent,
    HomeComponent,
    FooterComponent,
    CardViewComponent,
    CreateCardComponent,

    CardInitComponent,
    SavedcardsComponent,
    PageNotFoundComponent,
    OfflinePageComponent,
    TocComponent,
    TacComponent,
    PrivacyComponent,
    IplthemeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    AngularFireDatabaseModule,
    NotifierModule.withConfig(customNotifierOptions),
    ImageCropperModule,
    AngularFireStorageModule,
    NgbModule,
    AngularTiltModule,
    ConnectionServiceModule,
    NgxKjuaModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    NgbModalModule,
    AnimateOnScrollModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
