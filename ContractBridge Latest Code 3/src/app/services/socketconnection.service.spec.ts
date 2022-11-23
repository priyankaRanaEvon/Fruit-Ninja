import { TestBed } from '@angular/core/testing';

import { SocketconnectionService } from './socketconnection.service';

describe('SocketconnectionService', () => {
  let service: SocketconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketconnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
