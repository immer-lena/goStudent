import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/classes/ad";
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {MeetingDateService} from "../../shared/services/meeting-date.service";

@Component({
  selector: 'a.bs-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styles: [
  ]
})
export class AdListItemComponent implements OnInit {

  @Input() ad!:Ad
  open_meeting_dates: MeetingDates[] =[];


  constructor(
    private mds: MeetingDateService
  ) {
  }

  ngOnInit(): void {
    this.open_meeting_dates = this.mds.getCurrentMeetingDatesByState(this.ad.meeting_dates, "open", true);
  }

  isCurrent(meeting_date:MeetingDates){
    let date= new Date(meeting_date.date);
    let today= new Date();
    return date>today;
  }

}
