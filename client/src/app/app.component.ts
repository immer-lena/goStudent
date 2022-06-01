import { Component } from '@angular/core';
import {AuthenticationService} from "./shared/services/authentication.service";
import {AdService} from "./shared/services/ad.service";
import {MeetingDateService} from "./shared/services/meeting-date.service";
import {MeetingDates} from "./shared/classes/meeting-dates";


@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styles: []
})

export class AppComponent {

  currentUser = this.authService.getCurrentUserId();
  markBell = false;

  constructor(
    private authService:AuthenticationService,
    private as : AdService,
    private mds : MeetingDateService
  ) {}


  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  getActiveUserId(){
    return this.authService.getCurrentUserId();
  }

  hasOpenRequests():void{
    this.mds.hasOpenRequests(Number(this.currentUser)).subscribe(res=> {
      this.markBell = res;
    });
  }
}
