import { TestBed, async, inject } from '@angular/core/testing';

import { PricePageGuard } from './price-page.guard';

describe('PricePageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricePageGuard]
    });
  });

  it('should ...', inject([PricePageGuard], (guard: PricePageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
