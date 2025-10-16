import { TestBed } from '@angular/core/testing';

import { Trail } from './trail';

describe('Trail', () => {
  let service: Trail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
