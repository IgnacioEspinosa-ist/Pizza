import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { AdminPage } from './homeadmin.page';

describe('Adminpage', () => {
  let service: AdminPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminPage,
        { provide: SQLite, useClass: SQLiteMock } 
      ]
    });
    service = TestBed.inject(AdminPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
