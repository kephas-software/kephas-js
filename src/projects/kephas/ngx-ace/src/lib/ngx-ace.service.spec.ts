import { TestBed } from '@angular/core/testing';

import { NgxAceService } from './ngx-ace.service';

describe('NgxAceService', () => {
  let service: NgxAceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
