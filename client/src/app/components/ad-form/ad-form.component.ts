import {Component, OnInit} from "@angular/core";
import {Ad} from "../../shared/classes/ad";
import {AdFactory} from "../../shared/factories/ad-factory";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetingDateRequestErrorMessages} from "../meeting-date-request/meeting-date-request-error-messages";
import {DateFactory} from "../../shared/factories/date-factory";
import {Course} from "../../shared/classes/course";
import {AdFormErrorMessages} from "./ad-form-error-messages";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ToastrService} from "ngx-toastr";
import {MeetingDateService} from "../../shared/services/meeting-date.service";
import {CourseService} from "../../shared/services/course.service";
import {AdService} from "../../shared/services/ad.service";

@Component({
  selector: 'bs-request',
  templateUrl: './ad-form.component.html',
  styles: [
  ]
})
export class AdFormComponent implements OnInit {

  newAdForm: FormGroup;
  ad : Ad = AdFactory.empty();
  meeting_dates = this.fb.array([]);
  courses: Array<Course> = [];
  errors: { [key: string]: string } = {};
  ngSelect= "open";
  isUpdating = false;

  constructor(
    private fb:FormBuilder,
    private as: AdService,
    private mds:MeetingDateService,
    private cs: CourseService,
    private route:ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastr : ToastrService
  ) {
    this.newAdForm = this.fb.group({});
    this.meeting_dates = this.fb.array([]);
  }

  ngOnInit(): void {
    const ad_id = this.route.snapshot.params["ad_id"];
    if(ad_id){
      this.isUpdating = true;
      this.as.getSingleAd(ad_id).subscribe(a => {
        for(let i=0; i<a.meeting_dates.length; i++){
          if (a.meeting_dates[i].state != "open"){
            a.meeting_dates.splice(i,1);
          }
        }
        this.ad = a;
        this.initAdForm();
      })
    }
    this.cs.getAllCourses().subscribe(c => {
      this.courses = c;
    })
    this.initAdForm();
  }

  initAdForm(){
    this.buildMeetingDatesArray();
    this.newAdForm = this.fb.group({
      id: [this.ad.id],
      title: [this.ad.title, Validators.required],
      description: this.ad.description,
      course_id: [this.ad.course_id, Validators.required],
      meeting_dates: this.meeting_dates
    });
    this.newAdForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }

  buildMeetingDatesArray() {
    if(this.ad.meeting_dates.length >0){
      this.meeting_dates = this.fb.array([]);
      for(let date of this.ad.meeting_dates){
        let fg = this.fb.group({
          id: new FormControl(date.id),
          date: new FormControl(date.date, [Validators.required]),
          time: new FormControl(date.time,[Validators.required])
        });
        this.meeting_dates.push(fg);
      }
    }
  }

  addMeetingDateControl(){
    this.meeting_dates.push(this.fb.group({ id:0, date: null, time: null }));
  }


  updateErrorMessages() {
    this.errors = {};
    for (const message of AdFormErrorMessages) {
      const control = this.newAdForm.get(message.forControl);
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

    this.newAdForm.value.meeting_dates = this.newAdForm.value.meeting_dates.filter(
      (thumbnail:{date:string})=>thumbnail.date
    )
    const ad:Ad = AdFactory.formObject(this.newAdForm.value);
    for(let date of ad.meeting_dates){
      date.state = "open";
      date.ad_id = this.ad.id;
    }
    if(this.isUpdating){
      this.as.updateAd(ad).subscribe(res=>{
        this.newAdForm.reset(ad);
        this.toastr.success("Dein Angebot wurde erfolgreich bearbeitet", "Angebot aktualisiert");
        this.router.navigate(["../../../"],{relativeTo:this.route});
      })
    }else{
      ad.offer = Boolean(this.authService.userIsTutor());
      ad.user_id = String(this.authService.getCurrentUserId());
      this.cs.getCourseById(this.newAdForm.value["course_id"]).subscribe((course: Course) => {
        ad.course = course;
        ad.study_id = ad.course.study_id;
        this.as.createAd(ad).subscribe(res=>{

          this.ad = AdFactory.empty();
          this.newAdForm.reset(ad);
          this.toastr.success("Dein neues Angebot wurde erfolgreich angelegt", "Angebot gespeichert");
          this.router.navigate(["../../"],{relativeTo:this.route});
        });
      });
    }
  }

  deleteMeetingDate(event: any){
    let id = event.path[2].id;
    event.path[2].remove();
    this.meeting_dates.removeAt(id);
  }

}
