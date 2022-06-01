import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Ad} from "../../shared/classes/ad";
import {AdFactory} from "../../shared/factories/ad-factory";
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";
import {AdService} from "../../shared/services/ad.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'ts-ad-detail',
  templateUrl: './ad-detail.component.html',
  styles: [
  ]
})
export class AdDetailComponent implements OnInit {

  ad : Ad = AdFactory.empty();
  meeting_dates : MeetingDates[] =[];
  open_meeting_dates: MeetingDates[] = [];
  currentUserId = String(this.authService.getCurrentUserId());
  currentUserRole = this.authService.userIsTutor();

  constructor(
    private as: AdService,
    private mds: MeetingDateService,
    private route:ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.as.getSingleAd(params['id']).subscribe(a => {
      this.ad = a;
      this.open_meeting_dates = this.mds.getCurrentMeetingDatesByState(this.ad.meeting_dates, "open", true);
      this.meeting_dates = this.ad.meeting_dates;
    })
  }

  deleteAd(){
    let deletable =  true;
    for (let date of this.meeting_dates){
      if(date.state == "booked")
        deletable = false;
    }
    if(deletable){
      if(confirm("Willst du deine Anzeige wirklich löschen?")){
        this.as.deleteAd(this.route.snapshot.params["id"]).subscribe(res=> {
            this.router.navigate(["../"], {relativeTo:this.route});
            this.toastr.success("Anzeige wurde erfolgreich gelöscht");
          }
        );
      }
    } else {
      this.toastr.error("Du hast noch offene Termine", "Anzeige kann nicht gelöscht werden")
    }
  }

  canSendRequest(){
    if(this.ad.offer && this.currentUserRole == "0")
      return true;
    if(!this.ad.offer && this.currentUserRole == "1")
      return true;
    else return false;
  }

  toggleActive(ad:Ad){
    if(ad.active){
      if(window.confirm("Möchtest du diese Anzeige wirklich deaktivieren?")){
        ad.active = false;
        this.as.updateAd(ad).subscribe(res => console.log(res));
      }
    } else {
      if(window.confirm("Möchtest du diese Anzeige wieder aktivieren?")){
        ad.active = true;
        this.as.updateAd(ad).subscribe(res => console.log(res));
      }
    }

  }

}
