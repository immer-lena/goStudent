import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {AdService} from "../../shared/services/ad.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";

@Component({
  selector: 'bs-user-meetings',
  templateUrl: './user-meetings.component.html',
  styles: []
})
export class UserMeetingsComponent implements OnInit {

  currentUserId = Number(this.authService.getCurrentUserId());
  meetings: MeetingDates[] = [];
  openMeetingDates: MeetingDates[] = [];
  pastMeetingDates: MeetingDates[] = [];
  doneMeetingDates: MeetingDates[] = [];
  calledOfMeetingDates: MeetingDates[] = [];

  constructor(
    private as: AdService,
    private mds: MeetingDateService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.as.getAdsByUser(this.currentUserId).subscribe(a => {
      for (let ad of a) {
        for (let date of ad.meeting_dates){
          if(date.state != "open")
            this.meetings.push(date);
        }
      }
      this.mds.getSentRequests(this.currentUserId, "all").subscribe(sB =>{
        this.meetings.push(...sB);
        this.openMeetingDates = this.mds.getCurrentMeetingDatesByState(this.meetings, "booked", true);
        this.pastMeetingDates = this.mds.getCurrentMeetingDatesByState(this.meetings, "booked", false);
        this.doneMeetingDates = (this.mds.getCurrentMeetingDatesByState(this.meetings, "done", false));
        this.calledOfMeetingDates = (this.mds.getCurrentMeetingDatesByState(this.meetings, "calledOf", false));
      })
    });
  }
}
