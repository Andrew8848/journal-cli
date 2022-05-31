import { TestBed } from '@angular/core/testing';

import { LogDataSource } from './log-data-source';

describe('LogDataSource', () => {
  let service: LogDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
