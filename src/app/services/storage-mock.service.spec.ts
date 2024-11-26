import { TestBed } from '@angular/core/testing';
import { StorageMock } from './storage-mock.service';

describe('StorageMockService', () => {
  let service: StorageMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageMock]
    });
    service = TestBed.inject(StorageMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });
});
