import { Injectable } from '@angular/core';
import {catchError, Observable, retry, throwError} from "rxjs";
import {User} from "../classes/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api"

  constructor(
    private http: HttpClient
  ) { }

  getSingleUser(id:number):Observable<User>{
    return this.http.get<User>(`${this.api}/user/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  register(newUser:User):Observable<any>{
    return this.http.post<User>(`${this.api}/user`, newUser)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateUser(user:User):Observable<any>{
    return this.http.put<User>(`${this.api}/user/${user.id}/admin`, user)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
}

