import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProductoPage } from './detalle-producto.page';
import { DatabaseService } from 'src/app/services/database.service'; // Si necesitas DatabaseService o dependencias similares
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; // Si estás usando un mock de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
 // Mock de Storage
import { Storage } from '@ionic/storage-angular'; // Importa Storage
import { StorageMock } from 'src/app/services/storage-mock.service';

describe('DetalleProductoPage', () => {
  let component: DetalleProductoPage;
  let fixture: ComponentFixture<DetalleProductoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleProductoPage], // Asegúrate de declarar el componente
      providers: [
        DatabaseService, // Agrega cualquier servicio que necesite el componente
        { provide: SQLite, useClass: SQLiteMock }, // Agrega mocks si es necesario
        { provide: Storage, useClass: StorageMock }, // Agrega el mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado correctamente
  });
});
