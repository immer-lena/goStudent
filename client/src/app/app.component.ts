import { Component } from '@angular/core';
import {AuthenticationService} from "./shared/services/authentication.service";


@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  constructor(
    private authService:AuthenticationService
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
}
