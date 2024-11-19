import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service'; // Asegúrate de que tu servicio esté correctamente importado
import { SQLiteMock } from './sqlite-mock.service'; // Importa el mock de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: SQLite, useClass: SQLiteMock } // Asegúrate de proporcionar el mock aquí
      ]
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
