import { TestBed } from '@angular/core/testing';

import { DummyService } from './dummy.service';

describe('DummyService', () => {
  let service: DummyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
