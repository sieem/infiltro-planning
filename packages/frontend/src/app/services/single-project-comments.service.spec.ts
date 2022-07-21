import { TestBed } from '@angular/core/testing';

import { SingleProjectCommentsService } from './single-project-comments.service';

describe('SingleProjectCommentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SingleProjectCommentsService = TestBed.get(SingleProjectCommentsService);
    expect(service).toBeTruthy();
  });
});
