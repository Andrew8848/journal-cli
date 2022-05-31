import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatCalendar} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";
import {DatePicker} from "../date-form/DatePicker";
import {MAT_RADIO_DEFAULT_OPTIONS} from "@angular/material/radio";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {JournalRequestService} from "../service/journal-request.service";
import {PostJournalForm} from "../model/JournalModel";
import {Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-journal-dialog',
  templateUrl: './create-journal-dialog.component.html',
  styleUrls: ['./create-journal-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateJournalDialogComponent implements OnInit {

  datePicker = DatePicker;

  journalForm!: FormGroup;

  @ViewChild('buttonAddJournal') buttonAddJournal?: MatButton;

  constructor(
    private form: FormBuilder,
    private journalService: JournalRequestService,
    private snackbar: MatSnackBar
  ) {
    this.journalForm = this.form.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      consultation: ['', Validators.required],
      diagnosis: ['', Validators.required]
    });
  }

  get name(){return this.journalForm.get('name')}
  get surname(){return this.journalForm.get('surname')}
  get dateOfBirth(){return this.journalForm.get('dateOfBirth')}
  get consultation(){return this.journalForm.get('consultation')}
  get diagnosis(){return this.journalForm.get('diagnosis')}

  ngOnInit(): void {
    this.journalForm.valueChanges.subscribe(x => this.formChanging())
  }

  formChanging() {
    if(this.journalForm.valid){
      this.buttonAddJournal!.disabled = false;
    }else {
      this.buttonAddJournal!.disabled = true;
    }
  }

  createJournal() {
    let journal: PostJournalForm = {
      patient: {
        nameSurname: {
          name: this.name?.value,
          surname: this.surname?.value
        },
        dateOfBirth: this.dateOfBirth?.value as Date
      },
      consultation: this.consultation?.value,
      diagnosis: this.diagnosis?.value
    }
    if(this.journalForm.valid) {
        this.journalService.postJournal(journal).subscribe(p => {
          this.journalForm.reset();
          this.snackbar.open("Journal added", "ok", {duration: 2000, panelClass: ['standard-snackbar']});
        });
    }
  }

  test() {
    console.log("enter");
  }
}
