import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Journal, JournalByPage} from "../model/JournalModel";
import {CollectionViewer} from "@angular/cdk/collections";
import {Log, LogOnPage} from "../model/LogModel";

@Injectable({
  providedIn: 'root'
})
export class LogDataSource {

  private logsSubject = new BehaviorSubject<Log[]>([]);

  public $logs: Observable<Array<Log>> = this.logsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false)

  public $loading = this.loadingSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPagesSubject = new BehaviorSubject<number>(0);
  private currentPageSubject = new BehaviorSubject<number>(0);

  public $totalItems = this.totalItemsSubject.asObservable();
  public $totalPages = this.totalPagesSubject.asObservable();
  public $currentPage = this.currentPageSubject.asObservable();


  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<Log[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadJournal(logsByPage: LogOnPage){
    this.logsSubject.next(logsByPage.logs);
    this.totalItemsSubject.next(Number(logsByPage.totalItems));
    this.totalPagesSubject.next(Number(logsByPage.totalPages));
    this.currentPageSubject.next(Number(logsByPage.currentPage));
  }

  loadingOn(): void {
    this.loadingSubject.next(true);
  }

  loadingOff(): void {
    this.loadingSubject.next(false);
  }
}
