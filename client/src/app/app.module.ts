import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AdListComponent} from './components/ad-list/ad-list.component';
import {AdListItemComponent} from './components/ad-list-item/ad-list-item.component';
import {AdDetailComponent} from './components/ad-detail/ad-detail.component';
import {AppRoutingModule} from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {StudyService} from "./shared/services/study.service";
import {MeetingDateRequestComponent} from './components/meeting-date-request/meeting-date-request.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileComponent} from './components/profile/profile.component';
import {AdFormComponent} from './components/ad-form/ad-form.component';
import {LoginComponent} from './components/login/login.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthenticationService} from "./shared/services/authentication.service";
import {TokenInterceptorService} from './shared/services/token-interceptor.service';
import {LoginInterceptorService} from "./shared/services/login-interceptor.service";
import {UserFormComponent} from "./components/user-form/user-form.component";
import {registerLocaleData} from "@angular/common";
import localDe from "@angular/common/locales/de";
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestListItemComponent } from './components/request-list-item/request-list-item.component';
import { UserMeetingsComponent } from './components/user-meetings/user-meetings.component';
import { UserMeetingsItemComponent } from './components/user-meetings-item/user-meetings-item.component';
import { RegisterComponent } from './components/register/register.component';
import {AdService} from "./shared/services/ad.service";
import {UserService} from "./shared/services/user.service";
import {CourseService} from "./shared/services/course.service";
import {MeetingDateService} from "./shared/services/meeting-date.service";
import {NgxPaginationModule} from "ngx-pagination";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';

registerLocaleData(localDe);

@NgModule({
  declarations: [
    AppComponent,
    AdListComponent,
    AdListItemComponent,
    AdDetailComponent,
    MeetingDateRequestComponent,
    ProfileComponent,
    AdFormComponent,
    LoginComponent,
    UserFormComponent,
    RequestListComponent,
    RequestListItemComponent,
    UserMeetingsComponent,
    UserMeetingsItemComponent,
    RegisterComponent,
    PageNotFoundComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule,
    ReactiveFormsModule, BrowserAnimationsModule, NgxPaginationModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      maxOpened: 4,
      tapToDismiss:true,
      preventDuplicates: true
    }), FormsModule
  ],
  providers: [AuthenticationService, StudyService, AdService, UserService, CourseService, MeetingDateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoginInterceptorService,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'de'
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
