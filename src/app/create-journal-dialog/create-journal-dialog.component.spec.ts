import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJournalDialogComponent } from './create-journal-dialog.component';

describe('CreateJournalDialogComponent', () => {
  let component: CreateJournalDialogComponent;
  let fixture: ComponentFixture<CreateJournalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJournalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJournalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
