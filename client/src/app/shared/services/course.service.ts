import { Injectable } from '@angular/core';
import {catchError, Observable, retry, throwError} from "rxjs";
import {Course} from "../classes/course";
import {MeetingDates} from "../classes/meeting-dates";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api"

  constructor(
    private http: HttpClient
  ) { }

  getAllCourses():Observable<Array<Course>>{
    return this.http.get<Array<Course>>(`${this.api}/courses`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getCoursesofStudy(id:number):Observable<Array<Course>>{
    return this.http.get<Array<Course>>(`${this.api}/studies/${id}/courses`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getCourseById(id:number):Observable<Course>{
    return this.http.get<MeetingDates>(`${this.api}/courses/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
}
