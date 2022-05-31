import { TestBed } from '@angular/core/testing';

import { ErrorEmailExistService } from './error-email-exist.service';

describe('ErrorEmailExistService', () => {
  let service: ErrorEmailExistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorEmailExistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
