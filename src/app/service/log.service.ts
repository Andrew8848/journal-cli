import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {User} from "../model/UserModel";
import {LogOnPage} from "../model/LogModel";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private url = "http://localhost:8848/log/"

  constructor(private http: HttpClient, private userService: UserService) { }

  public getNewestlogsByPage(page: number, size: number) {
    return this.http.get<LogOnPage>(
      this.url+"newest",
      {
        observe: 'response',
        responseType: 'json',
        params: {
          page: page,
          size: size
        },
        headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()}
      }
    );
  }

  getNewestlogsByUsersOnPage(page: number, size: number, users: Array<User>) {
    return this.http.post<LogOnPage>(
      this.url+"newestByDoctor",
      users.map(value => value.doctor),
      {
        params: {
          page: page,
          size: size
        },
        headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()}
      }
    );
  }
}
