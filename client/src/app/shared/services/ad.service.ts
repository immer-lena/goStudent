import { Injectable } from '@angular/core';
import {catchError, Observable, retry, throwError} from "rxjs";
import {Ad} from "../classes/ad";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api"


  constructor(
    private http: HttpClient
  ) { }

  getAllAds():Observable<Array<Ad>>{
    return this.http.get<Array<Ad>>(`${this.api}/ads`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSingleAd(id:number):Observable<Ad>{
    return this.http.get<Ad>(`${this.api}/ads/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAdsByUser(id:number):Observable<Array<Ad>>{
    return this.http.get<Ad>(`${this.api}/user/${id}/ads`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAdsOfCourse(id:number):Observable<Array<Ad>>{
    return this.http.get<Array<Ad>>(`${this.api}/courses/${id}/ads`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAdsOfStudy(id:number):Observable<Array<Ad>>{
    return this.http.get<Array<Ad>>(`${this.api}/studies/${id}/ads`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  createAd(ad:Ad):Observable<any>{
    return this.http.post(`${this.api}/ads`, ad)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateAd(ad:Ad):Observable<any>{
    return this.http.put(`${this.api}/ads/${ad.id}`, ad)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  deleteAd(id:number):Observable<any>{
    return this.http.delete(`${this.api}/ads/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
}
