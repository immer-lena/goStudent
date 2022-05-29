import {Component, OnInit} from '@angular/core';
import {Ad} from "../../shared/classes/ad";
import {StudyService} from "../../shared/services/study.service";
import {Course} from "../../shared/classes/course";
import {Study} from "../../shared/classes/study";
import {AdService} from "../../shared/services/ad.service";
import {CourseService} from "../../shared/services/course.service";
import {AuthenticationService} from "../../shared/services/authentication.service";



@Component({
  selector: 'ts-ad-list',
  templateUrl: './ad-list.component.html',
  styles: []
})
export class AdListComponent implements OnInit {

  ads: Ad[] = [];
  courses: Course[] = [];
  studies: Study[] = [];
  chosenStudy: string = "choose";
  chosenCourse: string = "choose";
  shownAds: Ad[] = [];
  coursesOfStudy: Course[] = [];
  numberOfFilter: number = 0;
  userIsTutor = this.authService.userIsTutor();
  offer: number = 1- Number(this.userIsTutor);
  p:number = 1;

  constructor(
    private ss: StudyService,
    private as: AdService,
    private cs: CourseService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    console.log("offer " + this.offer);
    this.as.getAllAds().subscribe(res => {
      console.log(res);
      this.ads = res;
      this.shownAds = res;
    });

    this.ss.getAllStudies().subscribe(res => {
      console.log(res);
      this.studies = res;
    })

  }

  selectChangeEventStudy() {
    this.coursesOfStudy = [];
    this.cs.getCoursesofStudy(Number(this.chosenStudy)).subscribe(res => {
      console.log(res);
      this.coursesOfStudy = res;
      this.chosenCourse = "choose";
    });
  }

  clearFilter() {
    this.chosenStudy = "choose";
    this.chosenCourse = "choose";
    this.shownAds = this.ads;
    this.numberOfFilter = 0;
    this.toggleFilters();
  }

  toggleFilters() {
    document.getElementById("ad-filters")?.classList.toggle("d-none");
  }

  toggleOffer(target: any) {
    if (target.classList.contains("offer"))
      this.offer = 1;
    else
      this.offer = 0;
  }

  filter() {
    let filteredAds: Ad[] = [];
    for (let ad of this.ads) {
      if (Number(ad.offer) == this.offer) {
        console.log(ad.offer + " - " + this.offer);
        if (this.chosenStudy != "choose") {
          if (String(ad.study_id) == this.chosenStudy) {
            console.log(ad.study_id + " - " + this.chosenStudy);
            if (this.chosenCourse != "choose") {
              if (String(ad.course_id) == this.chosenCourse) {
                filteredAds.push(ad);
                this.numberOfFilter = 3;
                console.log("Courses " + ad.course_id + " - " + this.chosenCourse);
              }
            } else {
              filteredAds.push(ad);
              this.numberOfFilter = 2;
            }
          }
        } else {
          filteredAds.push(ad);
          this.numberOfFilter = 1;
        }
      }
    }
    this.shownAds = filteredAds;
  }
}

