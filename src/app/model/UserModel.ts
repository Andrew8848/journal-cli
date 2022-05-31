import {DateTime, Doctor, Enumerate} from "./Form";

export interface User{
  id?: Number;
  doctor: Doctor;
  password?: Number;
  dateTimeCreation?: DateTime;
  dateTimeWasOnline?: DateTime;
  roles?: Array<Role>;
}

export interface Role{
  id?: Number;
  value: String;
  privileges: Array<Enumerate>;
}

export interface UserToken {
  name: String;
  surname: String;
  email: String;
  role: Array<String>;
  jwtToken: String;
}

export interface RegistrationForm{
  doctor: Doctor;
  password: String;
}

