import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { StorageMock } from './storage-mock.service'; // Asegúrate de importar el mock
import { Storage } from '@ionic/storage-angular';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarritoService,
        { provide: Storage, useClass: StorageMock } // Proporciona el mock aquí
      ]
    });
    service = TestBed.inject(CarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
