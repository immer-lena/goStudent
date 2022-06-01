import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserFactory} from "../../shared/factories/user-factory";
import {Ad} from "../../shared/classes/ad";
import {User} from "../../shared/classes/user";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {AdService} from "../../shared/services/ad.service";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'ts-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  user:User = UserFactory.empty();
  ads:Ad[] = [];
  activeAds:Ad[] = [];
  inactiveAds:Ad[] = [];
  isTutor = this.authService.userIsTutor();

  constructor(
    private us:UserService,
    private as:AdService,
    private route:ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.us.getSingleUser(params['id']).subscribe(u => {
      this.user = u;
    })

    this.as.getAdsByUser(params['id']).subscribe(a =>{
      this.ads = a;
      for (let ad of this.ads){
        if(ad.active) this.activeAds.push(ad);
        else this.inactiveAds.push(ad);
      }
    })

  }

  getActiveUserId(){
    return this.authService.getCurrentUserId();
  }


}
