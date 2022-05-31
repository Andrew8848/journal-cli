import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import {MatSliderModule} from "@angular/material/slider";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from "@angular/common/http";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatPasswordStrengthModule} from "@angular-material-extensions/password-strength";
import {MatIconModule} from "@angular/material/icon";
import {TableVirtualScrollModule} from "ng-table-virtual-scroll";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import { CreateJournalDialogComponent } from './create-journal-dialog/create-journal-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DatePicker} from "./date-form/DatePicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { EditJournalComponent } from './edit-journal/edit-journal.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { JournalLogComponent } from './journal-log/journal-log.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PageNotFoundComponent,
    SignInDialogComponent,
    SignUpDialogComponent,
    CreateJournalDialogComponent,
    DatePicker,
    EditJournalComponent,
    UserManagementComponent,
    JournalLogComponent,
    ConfirmationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    ScrollingModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    MatPasswordStrengthModule,
    MatIconModule,
    ScrollingModule,
    TableVirtualScrollModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatDividerModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
