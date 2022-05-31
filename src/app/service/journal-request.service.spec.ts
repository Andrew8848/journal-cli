import { TestBed } from '@angular/core/testing';

import { JournalRequestService } from './journal-request.service';

describe('JournalRequestService', () => {
  let service: JournalRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
