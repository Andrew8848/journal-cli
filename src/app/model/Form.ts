type Nullable<T> = T | null

export interface Enumerate{
  id?: Number;
  value: String;
}

export interface NameSurname {
  name: String;
  surname: String;
}

export interface DateTime{
  date?: String;
  time?: String;
}

export interface Doctor{
  id?: Number;
  nameSurname?: NameSurname;
  email: String;
}

export interface Patient{
  id?: Number;
  nameSurname: NameSurname;
  dateOfBirth: Date;
}

export interface ApiMessage{
  status: String;
  message: String;
}
