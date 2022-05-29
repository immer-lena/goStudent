import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AdListComponent} from "./components/ad-list/ad-list.component";
import {AdDetailComponent} from "./components/ad-detail/ad-detail.component";
import {MeetingDateRequestComponent} from "./components/meeting-date-request/meeting-date-request.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LoginComponent} from "./components/login/login.component";
import {AdFormComponent} from "./components/ad-form/ad-form.component";
import {UserFormComponent} from "./components/user-form/user-form.component";
import {CanNavigateToAdminGuard} from "./can-navigate-to-admin.guard";
import {CanSendRequestGuard} from "./can-send-request.guard";
import {RequestListComponent} from "./components/request-list/request-list.component";
import {UserMeetingsComponent } from './components/user-meetings/user-meetings.component';
import {RegisterComponent} from "./components/register/register.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";


const routes : Routes = [
  {path: '', redirectTo: 'ads', pathMatch: 'full'},
  {path: 'ads', component:AdListComponent},
  {path: 'ads/:id', component:AdDetailComponent},
  {path: 'ads/:id/request', component: MeetingDateRequestComponent, canActivate:[CanSendRequestGuard]},
  {path: 'user/:id/requests', component:RequestListComponent},
  {path: 'user/:id/meetings', component:UserMeetingsComponent},
  {path: 'user/:id/admin/ads', component:AdFormComponent, canActivate:[CanNavigateToAdminGuard]},
  {path: 'user/:id/admin/ads/:ad_id', component:AdFormComponent, canActivate:[CanNavigateToAdminGuard]},
  {path: 'user/:id/admin', component: RegisterComponent, canActivate:[CanNavigateToAdminGuard]},
  {path: 'user/:id', component: ProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', pathMatch: 'full', component: PageNotFoundComponent}
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: []
})
export class AppRoutingModule { }
