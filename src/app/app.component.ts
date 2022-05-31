import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {SignInDialogComponent} from "./sign-in-dialog/sign-in-dialog.component";
import {SignUpDialogComponent} from "./sign-up-dialog/sign-up-dialog.component";
import {UserService} from "./service/user.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface UserLoginForm{
  email: String;
  password: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'DDMU416Journal';

  userName: string = "";
  userSurame: string = "";
  email: string = "";
  userExist = false;

  isOwner = false;

  accesStatus!: boolean;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private snackbar: MatSnackBar,
  ) {

  }

  public openSignInDialog(){
    const _dialogRef = this.dialog.open(SignInDialogComponent);
    _dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'LOGIN'){
        this.userService.authenticate(result.data.email, result.data.password).subscribe(auth =>{
          this.userService.setUserCookie(auth);
          this.userExist = true;
          this.checkOwner();
          this.ngOnInit();
          window.location.reload();
        }, error => {
          this.snackbar.open("Email or password is incorrect", "ok", {duration: 4000, panelClass: ['standard-snackbar']});
        });
      }
    })
  }

  private checkOwner(){
    try {
      if (this.userService.getCookieRoles()[0].value == "OWNER") {
        this.isOwner = true;
      }
    } catch (e) {
      this.isOwner = false;
    }
  }

  public openSignUpDialog(){
    const _dialogRef = this.dialog.open(SignUpDialogComponent);
  }

  refreshCookieField(){
    try {
      if (this.userExist) {
        this.userName = this.userService.getCookieUserName();
        this.userSurame = this.userService.getCookieUserSurname();
        this.email = this.userService.getCookieEmail();
      }
    } catch (e) {

    }
  }

  ngOnInit(): void {
    this.userExist = this.userService.userCookieIsExist();
    this.checkOwner();
    this.refreshCookieField();
  }

  logout() {
    this.userService.deleteUserCookies();
    this.isOwner = false;
    this.userExist = false;
    window.location.reload();
  }

}
