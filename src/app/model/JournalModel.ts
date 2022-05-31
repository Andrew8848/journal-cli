import {DateTime, Doctor, Enumerate, Patient} from "./Form";

// export interface Journal{
//   id?: Number;
//   doctor: Doctor;
//   patient: Patient;
//   dateTimePublication: DateTime;
//   dateTimeLastModified: DateTime | null;
//   consultant: Enumerate;
//   diagnosis: String;
//   journalStatus: Enumerate;
// }

export interface Journal{
  id?: Number;
  doctor: Doctor;
  patient: Patient;
  dateTimePublication: DateTime;
  dateTimeLastModified: DateTime | null;
  consultation: Enumerate;
  diagnosis: String;
  journalStatus: Enumerate;
}

export interface JournalByPage{
  totalItems: Number;
  totalPages: Number;
  currentPage: Number;
  journals: Array<Journal>;
}

export interface PostJournalForm{
  patient: Patient;
  consultation: String;
  diagnosis: String;
}
