import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {Journal, JournalByPage, PostJournalForm} from "../model/JournalModel";
import {query} from "@angular/animations";
import {UserService} from "./user.service";
import {User} from "../model/UserModel";
// import {error} from "@angular/compiler/src/util";

@Injectable({
  providedIn: 'root'
})
export class JournalRequestService {

  private url = "api/journal/"

  constructor(private http: HttpClient, private userService: UserService) { }

   public getNewestJournalsByPage(page: number, size: number) {
     return this.http.get<JournalByPage>(
       this.url+"newest",
       {
         observe: 'response',
         responseType: 'json',
         params: {
           page: page,
           size: size
         }
       }
       );
   }

  public getNewestJournalsByPageForElevated(page: number, size: number) {
    return this.http.get<JournalByPage>(
      this.url+"newestForElevatedUser",
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

  getNewestJournalsByUsersOnPage(page: number, size: number, users: Array<User>) {
    return this.http.post<JournalByPage>(
      this.url+"newestByDoctor",
       users.map(value => value.doctor),
      {
        params: {
          page: page,
          size: size
        },
      }
    );
  }

  getNewestJournalsByUsersOnPageForElevated(page: number, size: number, users: Array<User>) {
    return this.http.post<JournalByPage>(
      this.url+"newestByDoctorForElevatedUser",
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

  public getRecentlyDeletedJournalsByPage(page: number, size: number) {
    return this.http.get<JournalByPage>(
      this.url+"deletedRecently",
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

  public getRecentlyDeletedJournalsByDoctorsonPage(page: number, size: number, users: Array<User>) {
    return this.http.post<JournalByPage>(
      this.url+"deletedRecentlyByDoctor",
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

  postJournal(journal: PostJournalForm){
    return this.http.post(this.url+"createJournal", {
      patient: journal.patient,
      consultation: journal.consultation,
      diagnosis: journal.diagnosis
    }, {
      headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()}
    });
  }

  editJournal(newJournal: Journal){
    return this.http.post(this.url+"editJournal",
      newJournal,
      {
        headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()}
      }
      );
  }

  hideJournal(id: number){
    return this.http.post(this.url+"hideJournal", {}, {
      headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()},
      params:{id: id}
    });
  }

  openJournal(id: number){
    return this.http.post(this.url+"openJournal", {}, {
      headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()},
      params:{id: id}
    });
  }

  deleteJournal(id: number){
    return this.http.post(this.url+"deleteJournal", {}, {
      headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()},
      params:{id: id}
    });
  }

  restoreDeletedJournal(id: number){
    return this.http.post(this.url+"restoreDeletedJournal", {}, {
      headers:{'Authorization': 'Bearer ' + this.userService.getCookieToken()},
      params:{id: id}
    });
  }


}
