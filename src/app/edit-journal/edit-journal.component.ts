import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DatePicker} from "../date-form/DatePicker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {JournalRequestService} from "../service/journal-request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Journal, PostJournalForm} from "../model/JournalModel";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatRadioGroup} from "@angular/material/radio";

@Component({
  selector: 'app-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.scss']
})
export class EditJournalComponent implements OnInit {

  datePicker = DatePicker;

  journalForm!: FormGroup;

  newJournal!: Journal

  @ViewChild('buttonAddJournal') buttonAddJournal?: MatButton;
  @ViewChild('radio') radio?: MatRadioGroup;

  constructor(
    private form: FormBuilder,
    private journalService: JournalRequestService,
    private dialogRef: MatDialogRef<EditJournalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Journal,
    private snackbar: MatSnackBar
  ) {
    this.journalForm = this.form.group({
      name: [this.data.patient.nameSurname?.name, Validators.required],
      surname: [this.data.patient.nameSurname?.surname, Validators.required],
      dateOfBirth: [this.data.patient.dateOfBirth, Validators.required],
      consultation: [this.data.consultation, Validators.required],
      diagnosis: [this.data.diagnosis, Validators.required]
    });
  }

  get name(){return this.journalForm.get('name')}
  get surname(){return this.journalForm.get('surname')}
  get dateOfBirth(){return this.journalForm.get('dateOfBirth')}
  get consultation(){return this.journalForm.get('consultation')}
  get diagnosis(){return this.journalForm.get('diagnosis')}

  ngOnInit(): void {
    this.newJournal = this.data;
    switch(this.data.consultation.value){
      case "POLICLINIC":{
        this.journalForm.get('consultation')?.setValue("POLICLINIC")
        break;
      }
      case "HOSPITAL":{
        this.journalForm.get('consultation')?.setValue("HOSPITAL")
        break;
      }

    }
    this.journalForm.valueChanges.subscribe(x => this.formChanging())
  }

  formChanging() {
    if(this.journalForm.valid){
      this.buttonAddJournal!.disabled = false;
    }else {
      this.buttonAddJournal!.disabled = true;
    }
  }

  editJournal() {
    if(this.journalForm.valid) {
      this.newJournal.patient.nameSurname.name = this.name?.value;
      this.newJournal.patient.nameSurname.surname = this.surname?.value;
      this.newJournal.patient.dateOfBirth = this.dateOfBirth?.value;
      this.newJournal.consultation.value = this.consultation?.value;
      this.newJournal.diagnosis = this.diagnosis?.value;

      this.journalService.editJournal(this.newJournal).subscribe(p => {
        this.dialogRef.close({event: 'EDITED'});
      }, error => {
        this.snackbar.open("Failed to edit journal", "ok", {duration: 2000, panelClass: ['standard-snackbar']});
      });
    }
  }

}
