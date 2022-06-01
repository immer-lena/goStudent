import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {MeetingDates} from "../classes/meeting-dates";

@Injectable({
  providedIn: 'root'
})
export class MeetingDateService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api"

  constructor(
    private http: HttpClient
  ) { }

  getCurrentMeetingDatesByState(dates: MeetingDates[], state:string, current:boolean):MeetingDates[]{
    let result:MeetingDates[] = [];
    for (let date of dates){
      if (this.isCurrent(date) && current || !this.isCurrent(date) && !current) {
        if (date.state == state)
          result.push(date);
      }
    }
    result = this.sortMeetingDates(result);
    return result;
  }

  isCurrent(meeting_date:MeetingDates):boolean{
    let stringDate= String(meeting_date.date) + "T" + meeting_date.time;
    let date = new Date(stringDate);
    let today = new Date();
    return date > today;
  }

  sortMeetingDates(dates: MeetingDates[]):MeetingDates[]{
    return dates.sort((x, y) => +new Date(x.date) - +new Date(y.date));
  }

  getSingleMeetingDate(id:number):Observable<MeetingDates>{
    return this.http.get<MeetingDates>(`${this.api}/meeting_dates/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getMeetingDatesForAd(id:number):Observable<Array<MeetingDates>>{
    return this.http.get<Array<MeetingDates>>
    (`${this.api}/ads/${id}/meeting_dates`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateMeetingDate(meeting_date:MeetingDates|any):Observable<any>{
    let id = meeting_date.id;
    return this.http.put(`${this.api}/meeting_dates/${id}`, meeting_date)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  createMeetingDate(meeting_date:MeetingDates):Observable<any>{
    return this.http.post(`${this.api}/meeting_dates`, meeting_date)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  deleteMeetingDate(id:number):Observable<any>{
    return this.http.delete(`${this.api}/meeting_dates/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSentRequests(user_id:number, state:string):Observable<any>{
    if(state == "all"){
      return this.http.get(`${this.api}/meeting_dates/sent_requests/${user_id}/${state}`)
        .pipe(retry(3)).pipe(catchError(this.errorHandler));
    }
    return this.http.get(`${this.api}/meeting_dates/sent_requests/${user_id}/${state}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  hasOpenRequests(user_id:number):Observable<any>{
    return this.http.get(`${this.api}/meeting_dates/open_requests/${user_id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
}
