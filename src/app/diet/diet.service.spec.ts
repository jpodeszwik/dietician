import { TestBed } from '@angular/core/testing';

import { DietService } from './diet.service';

describe('DietService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DietService = TestBed.get(DietService);
    expect(service).toBeTruthy();
  });
});
