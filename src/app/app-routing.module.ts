import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardInitComponent } from './card-init/card-init.component';
import { CardViewComponent } from './card-view/card-view.component';
import { CreateCardComponent } from './create-card/create-card.component';
import { HomeComponent } from './home/home.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SavedcardsComponent } from './savedcards/savedcards.component';

import { TacComponent } from './tac/tac.component';
import { TocComponent } from './toc/toc.component';
import { PrivacyComponent } from './privacy/privacy.component';

import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { IplthemeComponent } from './specialEvents/ipltheme/ipltheme.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TocComponent },
  { path: 'conditions', component: TacComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'howitworks', component: HowItWorksComponent },
  {
    path: 'ipl2022/:cardId',
    component: IplthemeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'cardCreate',
    component: CardInitComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: 'cardView/:cardId', component: CardViewComponent },
  {
    path: 'card/edit/:cardId',
    component: CreateCardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'card/edit',
    component: CreateCardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'savedCards/:userId',
    component: SavedcardsComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
