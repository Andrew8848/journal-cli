import { Component, OnInit } from '@angular/core';
import {User} from "../model/UserModel";
import {UserService} from "../service/user.service";
import {MatSliderChange} from "@angular/material/slider";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users!: Array<User>;

  constructor(private userService: UserService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getAllUsers().subscribe(value => {
      console.log(value)
      this.users = value.body.users
    })
  }
  isStaff(user: User): boolean {
    for(let role of user.roles!){
      if(role.value == 'STAFF'){
        return true
      }
    }
    return false;
  }


  staffSwitch(id: Number, event: MatSlideToggleChange) {
    if(event.checked){
      this.userService.elevateUser(Number(id)).subscribe(value => {
        this.snackbar.open("user is elevated", "ok", {duration: 1000});
        this.loadUsers();
      })

    }else {
      this.userService.dropUser(Number(id)).subscribe(value => {
        this.snackbar.open("user is droped", "ok", {duration: 1000});
        this.loadUsers();
      })
    }
  }
}
