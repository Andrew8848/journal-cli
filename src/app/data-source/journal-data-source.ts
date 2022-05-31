import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Journal, JournalByPage} from "../model/JournalModel";
import {BehaviorSubject, catchError, finalize, Observable, of} from "rxjs";
import {JournalRequestService} from "../service/journal-request.service";
import {User} from "../model/UserModel";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";


@Injectable({
  providedIn: 'root'
})
export class JournalDataSource implements DataSource<Journal>{

  private journalSubject = new BehaviorSubject<Journal[]>([]);

  public $journals: Observable<Array<Journal>> = this.journalSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false)

  public $loading = this.loadingSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPagesSubject = new BehaviorSubject<number>(0);
  private currentPageSubject = new BehaviorSubject<number>(0);

  public $totalItems = this.totalItemsSubject.asObservable();
  public $totalPages = this.totalPagesSubject.asObservable();
  public $currentPage = this.currentPageSubject.asObservable();


  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<Journal[]> {
    return this.journalSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.journalSubject.complete();
    this.loadingSubject.complete();
  }

  loadJournal(journalByPage: JournalByPage){
    this.journalSubject.next(journalByPage.journals);
    this.totalItemsSubject.next(Number(journalByPage.totalItems));
    this.totalPagesSubject.next(Number(journalByPage.totalPages));
    this.currentPageSubject.next(Number(journalByPage.currentPage));
  }

  loadingOn(): void {
    this.loadingSubject.next(true);
  }

  loadingOff(): void {
    this.loadingSubject.next(false);
  }
}
