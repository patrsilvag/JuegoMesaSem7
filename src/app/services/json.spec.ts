import { TestBed } from '@angular/core/testing';

import { Json } from './json';

describe('Json', () => {
  let service: Json;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Json);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
