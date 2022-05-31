import { TestBed } from '@angular/core/testing';

import { JournalDataSource} from './journal-data-source';

describe('JournalDataSourceService', () => {
  let service: JournalDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
