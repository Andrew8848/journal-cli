import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorEmailExistService} from "../errors-states/error-email-exist.service";
import {UserService} from "../service/user.service";
import {MatButton} from "@angular/material/button";
import {CookieService} from "ngx-cookie-service";
import {UserToken} from "../model/UserModel";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {timeout} from "rxjs";
import {UserLoginForm} from "../app.component";

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {

  signInForm!: FormGroup;

  emailMatcher = new ErrorEmailExistService();

  @ViewChild('buttonLogin') buttonLogin?: MatButton;

  constructor(
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: UserLoginForm
  ) {
    this.signInForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  get email(){return this.signInForm.get('email')}
  get password(){return this.signInForm.get('password')}

  ngOnInit(): void {
    this.signInForm.valueChanges.subscribe(x => this.formChanging())
  }

  signIn() {
    this.dialogRef.close({
      event: 'LOGIN',
      data:{
        email: this.email?.value,
        password: this.password?.value
      }
    })
  }


  formChanging() {
    if(this.signInForm.valid){
      this.buttonLogin!.disabled = false;
    }else {
      this.buttonLogin!.disabled = true;
    }
  }
}
