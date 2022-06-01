import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ToastrService} from "ngx-toastr";
import {StudyService} from "../../shared/services/study.service";
import {UserService} from "../../shared/services/user.service";
import {CourseService} from "../../shared/services/course.service";
import {Study} from "../../shared/classes/study";
import {Course} from "../../shared/classes/course";
import {UserFactory} from "../../shared/factories/user-factory";
import {User} from "../../shared/classes/user";
import {AdFormErrorMessages} from "../ad-form/ad-form-error-messages";

@Component({
  selector: 'bs-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user:User =  UserFactory.empty();
  studies:Study[] =  [];
  courses:Course[] = [];
  courseIdsOfForm:number[] = [];
  isEditing = false;
  errors: { [key: string]: string } = {};
  obj: Course = new Course(0,"",0,0,new Study(0,"",""));

  constructor(
    private fb:FormBuilder,
    private ss: StudyService,
    private us: UserService,
    private cs: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({});
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    if(params["id"]){
      this.isEditing= true;
      this.us.getSingleUser(params["id"]).subscribe(res=> {
        this.user=res;
        this.cs.getAllCourses().subscribe(res => {
          this.courses = res;
        });
        this.initRegisterForm();
      } );
    }


    this.ss.getAllStudies().subscribe(res => this.studies = res);
    this.cs.getAllCourses().subscribe(res => {
      this.courses = res;
    });
    this.initRegisterForm();

  }

  initRegisterForm(){
    this.registerForm = this.fb.group({
      name:new FormControl(this.user.name, [Validators.required]),
      password:new FormControl(this.user.password,
        !this.isEditing?Validators.required:null),
      email: new FormControl( this.user.email,[Validators.required,Validators.email]),
      tutor: new FormControl( this.user.tutor, Validators.required),
      courses: new FormControl (this.user.courses),
      study_id: new FormControl(this.user.study_id == 0 ? 'choose' : this.user.study_id, Validators.required),
      semester: new FormControl(this.user.semester == "0" ? 'choose' : this.user.semester, Validators.required),
      introduction: new FormControl (this.user.introduction),
      profile_pic:new FormControl (this.user.profile_pic)
    });
    this.registerForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }

  async register(){
    const val = this.registerForm.value;
    this.ss.getStudyById(val["study_id"]).subscribe(res=> {
      val["study"]= res;
    });

    let newUser= UserFactory.formObject(val);
    if(newUser.profile_pic == null)
      newUser.profile_pic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    if(newUser.semester== "graduated"){
      newUser.graduated = true;
      newUser.semester= "";
    } else {
      newUser.graduated = false;
    }

    if(this.isEditing){
      newUser.id = this.user.id;
      this.us.updateUser(newUser).subscribe();
      this.router.navigate(["../"],{relativeTo:this.route});
      this.toastr.success("Profildaten erfolgreich geändert");
    }else {
      this.us.register(newUser).subscribe(res=> {
        this.router.navigate(["../login"],{relativeTo:this.route});
        this.toastr.success("Logge dich ein","Du wurdest registriert!");
      });
    }
  }


  updateErrorMessages() {
    this.errors = {};
    for (const message of AdFormErrorMessages) {
      const control = this.registerForm.get(message.forControl);
      if (control &&
        control.dirty &&
        control.invalid &&
        control.errors && control.errors[message.forValidator] &&
        !this.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  selectCourse(course:Course){
   return this.user.courses.some(obj=> obj.id === course.id)
  }
}

