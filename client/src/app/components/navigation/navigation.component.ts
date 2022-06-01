import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";

@Component({
  selector: 'nav.bs-navigation',
  templateUrl: './navigation.component.html',
  styles: [
  ]
})
export class NavigationComponent implements OnInit {

  currentUser = this.authService.getCurrentUserId();
  markBell = false;

  constructor(
    private authService: AuthenticationService,
    private mds : MeetingDateService
  ) { }

  ngOnInit(): void {
    this.hasOpenRequests();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  hasOpenRequests():void{
    this.mds.hasOpenRequests(Number(this.currentUser)).subscribe(res=> {
      this.markBell = res;
    });
  }

}
