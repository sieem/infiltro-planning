import { TestBed } from '@angular/core/testing';

import { SingleProjectArchiveService } from './single-project-archive.service';

describe('SingleProjectArchiveService', () => {
  let service: SingleProjectArchiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleProjectArchiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
