import { TestBed } from '@angular/core/testing';
import { SQLiteMock } from './sqlite-mock.service';

describe('SQLiteMockService', () => {
  let service: SQLiteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SQLiteMock]
    });
    service = TestBed.inject(SQLiteMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });
});
