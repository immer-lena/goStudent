import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Ad} from "../classes/ad";
import {Study} from "../classes/study";
import {Course} from "../classes/course";
import {MeetingDates} from "../classes/meeting-dates";
import {User} from "../classes/user";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api"

  constructor(
    private http:HttpClient
  ) { }


  getAllStudies():Observable<Array<Study>>{
    return this.http.get<Array<Study>>(`${this.api}/studies`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getStudyById(id:number):Observable<Study>{
    return this.http.get<Study>(`${this.api}/studies/${{id}}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
  }
