import { TestBed } from '@angular/core/testing';

import { ProjectEnumsService } from './project-enums.service';

describe('ProjectEnumsService', () => {
  let service: ProjectEnumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectEnumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
