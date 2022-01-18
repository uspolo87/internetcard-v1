import { TestBed } from '@angular/core/testing';

import { dbService } from './db.service';

describe('DbService', () => {
  let service: dbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
