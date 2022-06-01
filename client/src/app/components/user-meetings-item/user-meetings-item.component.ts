import {Component, Input, OnInit} from '@angular/core';
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {Ad} from "../../shared/classes/ad";
import {AdFactory} from "../../shared/factories/ad-factory";
import {Toast, ToastrService} from "ngx-toastr";
import {AdService} from "../../shared/services/ad.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: '.user-meetings-item',
  templateUrl: './user-meetings-item.component.html',
  styles: [
  ]
})
export class UserMeetingsItemComponent implements OnInit {

  @Input() meeting:MeetingDates |any;
  ad:Ad = AdFactory.empty()
  selectedOption: string | undefined;
  diffrenceInDays: number =0;
  currentUser= this.authService.getCurrentUserId();

  constructor(
    private as: AdService,
    private mds: MeetingDateService,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.as.getSingleAd(this.meeting.ad_id).subscribe(res=>this.ad=res);
    this.diffrenceInDays = this.getDifferenceInDays(new Date(this.meeting.date), new Date());
    this.selectedOption = "setState";
  }

  saveState(event:any){
    this.meeting.state = this.selectedOption;
    this.mds.updateMeetingDate(this.meeting).subscribe(res => {
      this.toastr.success("Status gesetzt");
      event.path[5].remove();
    });
  }

  isPast(){
    return !this.mds.isCurrent(this.meeting);
  }

  getDifferenceInDays(date1:Date, date2:Date){
    let timeInMilisec: number = date1.getTime() - date2.getTime();
    return Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
  }

}
