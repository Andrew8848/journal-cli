import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {JournalDataSource} from "../data-source/journal-data-source";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {MatButtonToggleGroup} from "@angular/material/button-toggle";
import {Journal, JournalByPage} from "../model/JournalModel";
import {FormControl} from "@angular/forms";
import {User} from "../model/UserModel";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription, tap} from "rxjs";
import {LogService} from "../service/log.service";
import {LogDataSource} from "../data-source/log-data-source";
import {Log, LogOnPage} from "../model/LogModel";
import {Doctor} from "../model/Form";

@Component({
  selector: 'app-journal-log',
  templateUrl: './journal-log.component.html',
  styleUrls: ['./journal-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalLogComponent implements OnInit, AfterViewInit {

  public dataSource!: LogDataSource;

  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSelect) selector?: MatSelect;
  @ViewChild(MatButtonToggleGroup) toggleGroup?: MatButtonToggleGroup;

  columnsToDisplay = [
    'numseq',
    'dateTime',
    'user',
    'doctor',
    'oldJournal',
    'newJournal',
    'action',
    'id'
  ];

  expandedElement: Log | null | undefined;

  sizeItems: number = 40;

  rowHeight: number = 48;

  toppingUsers!: FormControl;

  elevatedUsers?: Array<User>;

  private scrollingPosition?: number;

  private subscription?: Subscription;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {

  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(
        tap(() => {
          this.loadLogPage();
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

  ngOnInit(): void {
    this.toppingUsers = new FormControl();
    this.userService.getAllElevatedUsers().subscribe(response => {
      this.elevatedUsers = response.body!.users;
    });
    this.dataSource = new LogDataSource();
    if(this.subscription){
      this.subscription.unsubscribe();
    }
      this.dataSource.loadingOn();
      this.logService.getNewestlogsByPage(0, this.getAdaptSizeItemsOfHeightVirtScroll()).subscribe(value => {
        this.loadingDataSource(value.body!);
      });
  }

  loadLogPage() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    if (!this.selector?.empty) {
      this.dataSource.loadingOn();
      this.subscription = this.logService.getNewestlogsByUsersOnPage(this.paginator!.pageIndex, this.paginator!.pageSize, this.selector?.value).subscribe(value => {
        console.log(value);
        console.log(this.selector?.value);
        this.loadingDataSource(value);
      });
    }else if(this.toggleGroup?.value == "my"){
      this.loadMyLogs();
    }else {
      this.dataSource.loadingOn();
      this.subscription = this.logService.getNewestlogsByPage(this.paginator!.pageIndex, this.paginator!.pageSize).subscribe(value => {
        this.loadingDataSource(value.body!);
      });
    }
  }

  loadingDataSource(logByPage: LogOnPage){
    this.dataSource.loadJournal(logByPage);
    this.viewport?.scrollTo({top: this.scrollingPosition});
    this.dataSource.loadingOff();
  }

  findDoctor(log: Log): Doctor{
    if(log.oldJournal != null){
      return log.oldJournal.doctor;
    } else if(log.newJournal != null){
      return log.newJournal.doctor
    }
    return {
      nameSurname: {
        name: "",
        surname: ""
      },
      email: ""
    };
  }

  selectorOnChange() {
    this.paginator?.firstPage();
    this.loadLogPage();
  }

  countSelectedElementInSelector(): any{
    try {
      return this.selector?.value.length;
    }catch (e) {
      return 0;
    }
  }

  loadMyLogs() {
    this.paginator?.firstPage()
    let myUser: User[] = [
      {
        doctor: {
          email: this.userService.getCookieEmail()
        },
      }
    ]
    this.dataSource.loadingOn();
    this.subscription = this.logService.getNewestlogsByUsersOnPage(this.paginator!.pageIndex, this.paginator!.pageSize, myUser).subscribe(value => {
      this.loadingDataSource(value);
    });

  }

}
