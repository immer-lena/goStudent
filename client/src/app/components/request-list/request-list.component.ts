import { Component, OnInit } from '@angular/core';
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {AdService} from "../../shared/services/ad.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";

@Component({
  selector: 'bs-request-list',
  templateUrl: './request-list.component.html',
  styles: [
  ]
})
export class RequestListComponent implements OnInit {

  requests:MeetingDates[] = [];
  currentUserID = Number(this.authService.getCurrentUserId());

  constructor(
    private as:AdService,
    private mds:MeetingDateService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.as.getAdsByUser(this.currentUserID).subscribe(a =>{
      console.log(a);
      for (let ad of a){
        this.mds.getMeetingDatesForAd(Number(ad.id)).subscribe(md=>{
          console.log(md);
          for(let date of md){
            if(date.state == "requested" || date.state=="suggested")
              this.requests.push(date);
            console.log(this.requests);
          }
        });
      }
    });
    console.log(this.requests);
  }

}
