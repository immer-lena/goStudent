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
        this.mds.getMeetingDatesForAd(Number(ad.id)).subscribe(md => {
          console.log(md);
          this.openMeetingDates = this.mds.getCurrentMeetingDatesByState(md, "booked", true);
          this.pastMeetingDates = this.mds.getCurrentMeetingDatesByState(md, "booked", false);
          this.doneMeetingDates = (this.mds.getCurrentMeetingDatesByState(md, "done", false));
          this.calledOfMeetingDates = (this.mds.getCurrentMeetingDatesByState(md, "calledOf", false));
          console.log(this.openMeetingDates);
          console.log(this.meetings);
        });
      }
    });
  }
}
