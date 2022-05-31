import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PasswordErrorStateService} from "../errors-states/password-error-state.service";
import {ErrorEmailExistService} from "../errors-states/error-email-exist.service";
import {STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent} from "@angular/cdk/stepper";
import {MustMatch} from "../service/MustMatch";
import {MatStepper} from "@angular/material/stepper";
import {MatButton} from "@angular/material/button";
import {ApiMessage, Doctor} from "../model/Form";
import {UserService} from "../service/user.service";
import {RegistrationForm} from "../model/UserModel";
import {HttpResponse} from "@angular/common/http";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-sign-up-dialog',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})
export class SignUpDialogComponent /*implements OnInit*/ {

  passwordLength = 6;

  firstForm!: FormGroup;
  secondForm!: FormGroup;

  emailMatcher = new ErrorEmailExistService();
  passwordMatcher = new PasswordErrorStateService();

  emailIsExist!: boolean;

  emailApiMessage!: ApiMessage;

  @ViewChild('buttonRegister') buttonRegister?: MatButton;
  @ViewChild('stepper') stepper?: MatStepper;

  constructor(
    public dialogReg: MatDialogRef<SignUpDialogComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.firstForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required]
    });

    this.secondForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    this.emailIsExist = false;
  }

  get name() {return this.firstForm.get('name')}
  get surname() {return this.firstForm.get('surname')}

  get email() {return this.secondForm.get('email')}
  get password() {return this.secondForm.get('password')}
  get confirmPassword() {return this.secondForm.get('confirmPassword')}

  get passlength(){return this.passwordLength}

  stepperChanging($event: StepperSelectionEvent) {
    if(this.firstForm.valid && this.secondForm.valid){
      this.buttonRegister!.disabled = false;
    }else {
      this.buttonRegister!.disabled = true;
    }
  }

  registerAndSendEmailVerification(){
    let reg: RegistrationForm = {
      doctor: {
        nameSurname: {
          name: this.name?.value,
          surname: this.surname?.value
        },
        email: this.email?.value
      },
      password: this.password?.value
    };

      this.userService.registration(reg).subscribe(response => {
        this.dialogReg.close();
      }, errorResponse => {
        if (errorResponse.error.apimessage.status == 'EMAIL_EXIST') {
          this.emailApiMessage = errorResponse.error.apimessage;
          this.stepper?.previous();
          this.emailIsExist = true;
        }
      });


  }
}
