import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {JournalRequestService} from "../service/journal-request.service";
import {Journal, JournalByPage,} from "../model/JournalModel";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {
  CdkVirtualScrollViewport,

} from "@angular/cdk/scrolling";
import {JournalDataSource} from "../data-source/journal-data-source";
import {MatPaginator} from "@angular/material/paginator";
import {Observable, Subscription, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateJournalDialogComponent} from "../create-journal-dialog/create-journal-dialog.component";
import {Role, User} from "../model/UserModel";
import {FormControl} from "@angular/forms";
import {Enumerate, NameSurname} from "../model/Form";

import { map } from 'rxjs/operators';
import {HttpResponse} from "@angular/common/http";
import {MatSelect} from "@angular/material/select";
import {CookieService} from "ngx-cookie-service";
import {EditJournalComponent} from "../edit-journal/edit-journal.component";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationComponent} from "../confirmation/confirmation.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, AfterViewInit{

  public dataSource!: JournalDataSource;

  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSelect) selector?: MatSelect;
  @ViewChild(MatButtonToggleGroup) toggleGroup?: MatButtonToggleGroup;

  columnsToDisplay = [
    'numseq',
    'doctor',
    'dateTimePub',
    'patient',
    'consultant',
    'id',
    'action'
  ];

  expandedElement: Journal | null | undefined;

  sizeItems: number = 40;

  rowHeight: number = 48;

  iAmOwner!: boolean

  iAmElevated!: boolean;

  isDeletable!: boolean;

  isEditable!: boolean;

  isReadable!: boolean;

  isWritable!: boolean;

  showDeletedJournals!: boolean;

  toppingUsers!: FormControl;
  elevatedUsers?: Array<User>;

  private scrollingPosition?: number;

  private subscription?: Subscription;

  constructor(
    private journalService: JournalRequestService,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
    ) {

  }

  ngAfterViewInit(): void {
    this.checkPrivileges();
    this.accessCheck();
    this.paginator?.page
      .pipe(
        tap(() => {
          this.loadJournalPage();
        })
      )
      .subscribe();
    this.viewport?.elementScrolled().subscribe(value => {
      this.scrollingPosition = this.viewport?.measureScrollOffset();
    })
    }

  private getAdaptSizeItemsOfHeightVirtScroll(): number{
      return Math.round(window.innerHeight / this.rowHeight);
    }

  public initSizeItemsOptions(): number[]{
      let i = 0;
      let sizeItemsOptions = Array.from(Array(5).keys());
      return sizeItemsOptions = sizeItemsOptions.map(elem => {
        i++;
          return Math.round(this.getAdaptSizeItemsOfHeightVirtScroll() * i);
      });

  }

  checkPrivileges(): void{

    try {
      let roles: any[] = this.userService.getCookieRoles();
      for (let role of roles) {
        if (this.findPrivilege(role.privileges, 'READ')) {
          this.isReadable = true;
        } else {
          this.isReadable = false;
        }
        if (this.findPrivilege(role.privileges, 'WRITE')) {
          this.isWritable = true;
        } else {
          this.isWritable = false;
        }
        if (this.findPrivilege(role.privileges, 'EDIT')) {
          this.isEditable = true;
        } else {
          this.isEditable = false;
        }
        if (this.findPrivilege(role.privileges, 'DELETE')) {
          this.isDeletable = true;
        } else {
          this.isDeletable = false;
        }
        if(role.value == "OWNER"){
          this.iAmOwner = true;
        } else {
          this.iAmOwner = false;
        }
      }
    } catch (e) {
      this.isReadable = false;
      this.isWritable = false;
      this.isEditable = false;
      this.isDeletable = false;
    }
  }

  private findPrivilege(privileges: Array<Enumerate>, findPrivilege: string){
    try {
      for (let privilege of privileges) {
        if (privilege.value == findPrivilege) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  private accessCheck(): void{
    if(this.isEditable){
      this.iAmElevated = true;
    } else{
      this.iAmElevated = false;
    }
  }

  ngOnInit(): void {
    this.checkPrivileges();
    this.accessCheck();
    this.toppingUsers = new FormControl();
    this.userService.getAllElevatedUsers().subscribe(response => {
      this.elevatedUsers = response.body!.users;
    });
    this.dataSource = new JournalDataSource();
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if(!this.iAmElevated){
      this.dataSource.loadingOn();
      this.subscription = this.journalService.getNewestJournalsByPage(0, this.getAdaptSizeItemsOfHeightVirtScroll()).subscribe(value => {
        this.loadingDataSource(value.body!);
      });
    }else {
      this.dataSource.loadingOn();
      this.subscription = this.journalService.getNewestJournalsByPageForElevated(0, this.getAdaptSizeItemsOfHeightVirtScroll()).subscribe(value => {
        this.loadingDataSource(value.body!);
      });
    }

  }

  loadJournalPage() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if(!this.iAmElevated) {
      if (!this.selector?.empty) {
        this.dataSource.loadingOn();
        this.subscription = this.journalService.getNewestJournalsByUsersOnPage(this.paginator!.pageIndex, this.paginator!.pageSize, this.selector?.value).subscribe(value => {
          this.loadingDataSource(value);
        });
      } else {
        this.dataSource.loadingOn();
        this.subscription = this.journalService.getNewestJournalsByPage(this.paginator!.pageIndex, this.paginator!.pageSize).subscribe(value => {
          this.loadingDataSource(value.body!);
        });
      }
    }else {
      if(!this.showDeletedJournals){
        if (!this.selector?.empty) {
          this.dataSource.loadingOn();
          this.subscription = this.journalService.getNewestJournalsByUsersOnPageForElevated(this.paginator!.pageIndex, this.paginator!.pageSize, this.selector?.value).subscribe(value => {
            this.loadingDataSource(value);
          });
        } else if (this.toggleGroup?.value == "my") {
          this.loadMyJournal();
        } else {
          this.dataSource.loadingOn();
          this.subscription = this.journalService.getNewestJournalsByPageForElevated(this.paginator!.pageIndex, this.paginator!.pageSize).subscribe(value => {
            this.loadingDataSource(value.body!);
          });
        }
      } else{
        if (!this.selector?.empty) {
          this.dataSource.loadingOn();
          this.subscription = this.journalService.getRecentlyDeletedJournalsByDoctorsonPage(this.paginator!.pageIndex, this.paginator!.pageSize, this.selector?.value).subscribe(value => {
            this.loadingDataSource(value);
          });
        }else if(this.toggleGroup?.value == "my"){
          this.loadMyJournal();
        }else {
          this.dataSource.loadingOn();
          this.subscription =  this.journalService.getRecentlyDeletedJournalsByPage(this.paginator!.pageIndex, this.paginator!.pageSize).subscribe(value => {
            this.loadingDataSource(value.body!);
          });
        }
      }
    }
  }

  loadingDataSource(journalByPage: JournalByPage){
    this.dataSource.loadJournal(journalByPage);
    this.viewport?.scrollTo({top: this.scrollingPosition});
    this.dataSource.loadingOff();
  }

  openCreateJournalDialog() {
    const _dialogRef = this.dialog.open(CreateJournalDialogComponent, {
      disableClose: true,
      height: 'auto',
      width: 'auto',
      maxHeight: '100vh',
      maxWidth: '100wh'
    });
  }

  selectorOnChange() {
    this.paginator?.firstPage();
    this.loadJournalPage();
  }

  countSelectedElementInSelector(): any{
    try {
      return this.selector?.value.length;
    }catch (e) {
      return 0;
    }
  }

  loadMyJournal() {
    this.paginator?.firstPage()
    let myUser: User[] = [
      {
        doctor: {
          email: this.userService.getCookieEmail()
        },
      }
    ]
    this.dataSource.loadingOn();

    if(!this.showDeletedJournals){
      this.subscription = this.journalService.getNewestJournalsByUsersOnPageForElevated(this.paginator!.pageIndex, this.paginator!.pageSize, myUser).subscribe(value => {
        this.loadingDataSource(value);
      });
    } else{
      this.subscription = this.journalService.getRecentlyDeletedJournalsByDoctorsonPage(this.paginator!.pageIndex, this.paginator!.pageSize, myUser).subscribe(value => {
        this.loadingDataSource(value);
      });
    }

  }

  hideJournal(id: number) {
    this.journalService.hideJournal(id).subscribe(value => {
      this.loadJournalPage();
    })
  }

  deleteJournal(id: number) {
    this.dialog.open(ConfirmationComponent).afterClosed().subscribe(result => {
      if(result.isConfirmed) {
        this.journalService.deleteJournal(id).subscribe(value => {
          this.snackbar.open("Journal deleted", "ok", {duration: 2000});
          this.loadJournalPage();
        }, error => {
          this.snackbar.open("Journal failed to delete", "ok", {duration: 2000});
          this.loadJournalPage();
        })
      }else{
        this.snackbar.open("Deleting journal cancel", "ok", {duration: 2000});
        this.loadJournalPage();
      }
    })
  }

  editJournal(journal: Journal) {
    this.dialog.open(EditJournalComponent, {
      data: journal
    }).afterClosed().subscribe(result => {
        if (result.event == 'EDITED') {
          this.loadJournalPage();
          this.snackbar.open("Journal edited", "ok", {duration: 2000, panelClass: ['standard-snackbar']});
        } else {
          this.loadJournalPage();
          this.snackbar.open("Journal editing canceled", "ok", {duration: 2000, panelClass: ['standard-snackbar']});
        }
    })
  }

  openJournal(id: number) {
    this.journalService.openJournal(id).subscribe(value => {
      this.loadJournalPage();
    })
  }

  scrolltest(){
    this.viewport?.scrollTo({top: 100});
    console.log(this.scrollingPosition);
  }

  setExistJournalFilter() {
    this.showDeletedJournals = false;
    this.loadJournalPage();
  }

  setDeletedJournalFilter() {
    this.showDeletedJournals = true;
    this.loadJournalPage();

  }

  restoreJournal(id: number) {
    this.journalService.restoreDeletedJournal(id).subscribe((value) => {
      this.snackbar.open("Journal Restored", "ok", {duration: 2000});
      this.loadJournalPage();
    }, error => {
      this.snackbar.open("Journal failed to restore", "ok", {duration: 2000});
      this.loadJournalPage();
    })
  }
}
