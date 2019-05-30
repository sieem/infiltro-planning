import { TestBed } from '@angular/core/testing';

import { PlanningDataService } from './planning-data.service';

describe('PlanningDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanningDataService = TestBed.get(PlanningDataService);
    expect(service).toBeTruthy();
  });
});
