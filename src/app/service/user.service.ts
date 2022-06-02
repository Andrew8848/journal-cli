import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegistrationForm, User, UserToken} from "../model/UserModel";
import {catchError, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {ApiMessage} from "../model/Form";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = "api/user/"

  private cookieUserNameKey = 'userName';
  private cookieUserSurnameKey= 'userSurname';
  private cookieEmailKey = 'userEmail';
  private cookieTokenKey = 'userToken';
  private cookieRoles = "userRoles";

  private cookieOk = "ok";
  private cookieNotFound = "not_found";



  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllUsers(){
    return this.http.get<any>(this.url +"getAllUsers", {
      observe: 'response',
      responseType: 'json',
      headers:{'Authorization': 'Bearer ' + this.getCookieToken()}
    });
  }

  getAllElevatedUsers(){
    return this.http.get<any>(this.url +"getAllElevatedUsers", {
      observe: 'response',
      responseType: 'json',
    });
  }

  registration(newUser: RegistrationForm) {
    return this.http.post<any>(this.url+"registerNewUser", {
      doctor: newUser.doctor,
      password: newUser.password
    });
  }

  authenticate(email: String, password: String): Observable<any>{
    return this.http.post(this.url+"authenticate", {
      email: email,
      password: password,
    });
  }

  elevateUser(id: number){
    return this.http.post(this.url +"elevateUser", {},{
      observe: 'response',
      responseType: 'json',
      params:{
        id: id
      },
      headers:{'Authorization': 'Bearer ' + this.getCookieToken()}
    });
  }

  dropUser(id: number){
    return this.http.post(this.url +"dropUser", {},{
      observe: 'response',
      responseType: 'json',
      params:{
        id: id
      },
      headers:{'Authorization': 'Bearer ' + this.getCookieToken()}
    });
  }

  setUserCookie(auth: UserToken){
    try {
      this.cookie.set(this.cookieUserNameKey, JSON.stringify(auth.name));
      this.cookie.set(this.cookieUserSurnameKey, JSON.stringify(auth.surname));
      this.cookie.set(this.cookieEmailKey, JSON.stringify(auth.email));
      this.cookie.set(this.cookieRoles, JSON.stringify(auth.role));
      this.cookie.set(this.cookieTokenKey, JSON.stringify(auth.jwtToken));
    }catch (e){

    }
  }



  getCookieUserName(){
    return JSON.parse(this.cookie.get(this.cookieUserNameKey));
  }

  getCookieUserSurname() {
    return JSON.parse(this.cookie.get(this.cookieUserSurnameKey));
  }

  getCookieEmail() {
    return JSON.parse(this.cookie.get(this.cookieEmailKey));
  }

  getCookieRoles(){
    return JSON.parse(this.cookie.get(this.cookieRoles))
  }

  getCookieToken() {
    return JSON.parse(this.cookie.get(this.cookieTokenKey));
  }

  userCookieIsExist(): boolean{
    if(this.getCookieEmail() != ""){
      return true;
    }
    return false;
  }


  deleteUserCookies() {
    this.cookie.deleteAll();
  }
}
