import {Journal} from "./JournalModel";
import {User} from "./UserModel";
import {DateTime, Enumerate} from "./Form";

export interface Log{
  id?: Number;
  user: User;
  logDateTime: DateTime;
  oldJournal?: Journal;
  newJournal?: Journal;
  action: Enumerate;
}

export interface LogOnPage{
  totalItems: Number;
  totalPages: Number;
  currentPage: Number;
  logs: Array<Log>;
}
