import {Component, Input, OnInit} from '@angular/core';
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {Ad} from "../../shared/classes/ad";
import {AdFactory} from "../../shared/factories/ad-factory";
import {ToastrService} from "ngx-toastr";
import {AdService} from "../../shared/services/ad.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: 'li.request-list-item',
  templateUrl: './request-list-item.component.html',
  styles: [
  ]
})
export class RequestListItemComponent implements OnInit {

  @Input () request: MeetingDates |undefined

  ad:Ad= AdFactory.empty();
  currentUserId = this.authService.getCurrentUserId();

  constructor(
    private as: AdService,
    private mds:MeetingDateService,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.as.getSingleAd(Number(this.request?.ad_id)).subscribe(a=>{
      this.ad= a;
    })
  }

  denyRequest(event:any){
    if(this.request?.state=="requested"){
      this.request.state = "open";
      this.request.user_id = "";
      this.request.user = undefined;
      this.mds.updateMeetingDate(this.request).subscribe(res=>{
        event.path[4].remove();
        this.toastr.success( "Anfrage wurde abgelehnt!");
      });
    } else {
      this.mds.deleteMeetingDate(Number(this.request?.id)).subscribe(res=> {
        event.path[4].remove();
        this.toastr.success( "Anfrage wurde abgelehnt!");
      })
    }
  }

  acceptRequest(event:any){
    // @ts-ignore
    this.request?.state = "booked";
    this.mds.updateMeetingDate(this.request).subscribe(res=>{
      event.path[4].remove();
      this.toastr.success( "Anfrage wurde angenommen!");
    });
  }


}
