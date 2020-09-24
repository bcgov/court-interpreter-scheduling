import { TestBed } from '@angular/core/testing';

import { InterpretersService } from './interpreters.service';

describe('InterpretersService', () => {
  let service: InterpretersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterpretersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
