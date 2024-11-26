import { TestBed } from '@angular/core/testing';
 // Asegúrate de que tu servicio esté correctamente importado
// Importa el mock de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { HomerepaPage } from './homerepa.page';


describe('HomerepaPage', () => {
  let service: HomerepaPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomerepaPage,
        { provide: SQLite, useClass: SQLiteMock } // Asegúrate de proporcionar el mock aquí
      ]
    });
    service = TestBed.inject(HomerepaPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
