import {Component, OnInit} from '@angular/core';
import {Ad} from "../../shared/classes/ad";
import {AdFactory} from "../../shared/factories/ad-factory";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MeetingDates} from "../../shared/classes/meeting-dates";
import {MeetingDateRequestErrorMessages} from "./meeting-date-request-error-messages";
import {DateFactory} from "../../shared/factories/date-factory";
import {ToastrService} from "ngx-toastr";
import {AdService} from "../../shared/services/ad.service";
import {MeetingDateService} from "../../shared/services/meeting-date.service";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'ts-request',
  templateUrl: './meeting-date-request.component.html',
  styles: []
})

export class MeetingDateRequestComponent implements OnInit {

  meetingDateRequestForm: FormGroup;
  ad: Ad = AdFactory.empty();
  meeting_date: MeetingDates = DateFactory.empty();
  errors: { [key: string]: string } = {};
  meeting_dates: MeetingDates[] = [];
  open_meeting_dates: MeetingDates[] = [];

  constructor(
    private fb: FormBuilder,
    private us: UserService,
    private as: AdService,
    private mds: MeetingDateService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.meetingDateRequestForm = this.fb.group({});
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.as.getSingleAd(params['id']).subscribe(a => {
      this.ad = a;
    })

    this.mds.getMeetingDatesForAd(params['id']).subscribe(md => {
      this.open_meeting_dates= this.mds.getCurrentMeetingDatesByState(md, "open", true);
      this.meeting_dates = md;
    });
    this.initMeetingDate();
  }

  initMeetingDate() {
    this.meetingDateRequestForm = this.fb.group({
      id: [this.meeting_date.id, Validators.required],
      date: [this.meeting_date.date],
      time: this.meeting_date.time,
      comment: this.meeting_date.comment,
    });
    this.meetingDateRequestForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }

  updateErrorMessages() {
    this.errors = {};
    for (const message of MeetingDateRequestErrorMessages) {
      const control = this.meetingDateRequestForm.get(message.forControl);
      if (control &&
        control.dirty &&
        control.invalid &&
        control.errors && control.errors[message.forValidator] &&
        !this.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  submitForm() {
    console.log(this.meetingDateRequestForm.value);
    let values = this.meetingDateRequestForm.value;
    let new_meeting_date = DateFactory.empty();

    this.mds.getSingleMeetingDate(this.meetingDateRequestForm.value['id']).subscribe(res_date => {
      new_meeting_date = res_date;
      console.log(new_meeting_date);

      if (new_meeting_date) {       //update Meeting-date
        new_meeting_date.state = "requested";
        new_meeting_date.comment = values["comment"];
        new_meeting_date.user_id = String(sessionStorage.getItem("user_id"));
        console.log(new_meeting_date);
        this.mds.updateMeetingDate(new_meeting_date).subscribe(res => {
          console.log(res);
          this.toastr.success("Deine Anfrage wurde erfolgreich versendet", "Anfrage versendet");
          this.router.navigate(["../"], {relativeTo: this.route});
        });
      } else {
        new_meeting_date = DateFactory.empty();
        new_meeting_date.state = "suggested";
        new_meeting_date.comment = values["comment"];

        //set date and time
        let dateTime = values["date"].split('T');
        new_meeting_date.time = dateTime[1];
        new_meeting_date.date = dateTime[0];

        new_meeting_date.ad_id = this.ad.id;
        new_meeting_date.user_id = String(sessionStorage.getItem("user_id"));
        this.us.getSingleUser(Number(new_meeting_date.user_id)).subscribe(res => new_meeting_date.user = res);


        console.log(new_meeting_date);
        this.mds.createMeetingDate(new_meeting_date).subscribe(res => {
          this.toastr.success("Deine Anfrage wurde erfolgreich versendet", "Anfrage versendet");
          this.router.navigate(["../"], {relativeTo: this.route});
        });
      }
    });
  }

  toggleDatepicker() {
    let checkbox = <HTMLInputElement>document.getElementById("new-meeting-input");
    if (checkbox.checked) {
      document.getElementById("new-meeting")?.classList.remove("d-none");
      document.getElementById("select-meeting-date")?.setAttribute("disabled", "true");
    } else {
      document.getElementById("new-meeting")?.classList.add("d-none");
      document.getElementById("select-meeting-date")?.removeAttribute("disabled");
    }
  }
}
