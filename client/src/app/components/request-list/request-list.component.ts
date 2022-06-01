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
  sentRequests:MeetingDates[] = [];
  currentUserID = Number(this.authService.getCurrentUserId());

  constructor(
    private as:AdService,
    private mds:MeetingDateService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.as.getAdsByUser(this.currentUserID).subscribe(a =>{
      for (let ad of a){
          for(let date of ad.meeting_dates){
            if(date.state == "requested" || date.state=="suggested")
              this.requests.push(date);
          }
      }
    });
    this.mds.getSentRequests(this.currentUserID, "requested").subscribe(res=>{
      this.sentRequests = res;
      this.mds.getSentRequests(this.currentUserID, "suggested").subscribe(sug => {
        this.sentRequests.push(...sug);
        this.mds.sortMeetingDates(this.sentRequests);
      })
    })
  }

}
