import { TestBed } from '@angular/core/testing';

import { PlayerjoinService } from './playerjoin.service';

describe('PlayerjoinService', () => {
  let service: PlayerjoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerjoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
