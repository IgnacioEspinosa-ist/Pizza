import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { RescontrasenaPage } from './rescontrasena.page';
import { StorageMock } from 'src/app/services/storage-mock.service';
import { Storage } from '@ionic/storage-angular';


describe('RescontrasenaPage', () => {
  let service: RescontrasenaPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RescontrasenaPage, // El componente que estamos probando
        { provide: SQLite, useClass: SQLiteMock }, // Proveer el mock de SQLite
        { provide: Storage, useClass: StorageMock },] // Usar el mock de Storage
});
    service = TestBed.inject(RescontrasenaPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el componente se haya creado correctamente
  });
});
