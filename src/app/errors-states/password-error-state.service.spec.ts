import { TestBed } from '@angular/core/testing';

import { PasswordErrorStateService } from './password-error-state.service';

describe('PasswordErrorStateService', () => {
  let service: PasswordErrorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordErrorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
