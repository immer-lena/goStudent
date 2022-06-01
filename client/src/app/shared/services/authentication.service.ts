import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import jwtDecode from "jwt-decode";
import {ToastrService} from "ngx-toastr";

interface Token {
  exp:number,
  user: {
    id:string,
    tutor: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private api = "http://tutoring.s1910456017.student.kwmhgb.at/api/auth"

  constructor(
    private http:HttpClient,
    private toastr: ToastrService
  ) { }

  login(email:string, password:string){
    return this.http.post(`${this.api}/login`, {
      email:email,
      password: password
    });
  }

  public setSessionStorage(token:string){
    this.toastr.success("Du bist eingeloggt!");
    const decodedToken = jwtDecode(token) as Token;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user_id", decodedToken.user.id);
    sessionStorage.setItem("tutor", String(decodedToken.user.tutor));
  }

  public getCurrentUserId(){
    return sessionStorage.getItem('user_id');
  }

  public userIsTutor(){
    return sessionStorage.getItem('tutor');
  }

  public isLoggedIn(){
    if(sessionStorage.getItem('token')){
      let token:string = <string>sessionStorage.getItem('token');
      const decodedToken = jwtDecode(token) as Token;
      let expirationDate:Date = new Date(0);
      expirationDate.setUTCDate(decodedToken.exp);
      if(expirationDate < new Date()){
        console.info("token expired");
        sessionStorage.removeItem("token");
        return false;
      } else
        return true;
    }
    return false;
  }

  public isLoggedOut(){
    return !this.isLoggedIn();
  }

  logout(){
    this.http.post(`${this.api}/login`, {});
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('tutor');
    this.toastr.success("Du bist ausgeloggt!");
  }
}
