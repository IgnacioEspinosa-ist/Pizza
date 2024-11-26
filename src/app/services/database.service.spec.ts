import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service'; 
import { SQLiteMock } from './sqlite-mock.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: SQLite, useClass: SQLiteMock } 
      ]
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
