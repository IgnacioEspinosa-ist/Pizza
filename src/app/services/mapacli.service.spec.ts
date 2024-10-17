import { TestBed } from '@angular/core/testing';

import { MapacliService } from './mapacli.service';

describe('MapacliService', () => {
  let service: MapacliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapacliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
