import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page'; // Importa el componente a probar
import { DatabaseService } from 'src/app/services/database.service'; // Servicio de base de datos
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; // Mock de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite real
import { Storage } from '@ionic/storage-angular'; // Importación de Storage
import { StorageMock } from 'src/app/services/storage-mock.service'; // Mock de Storage

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilPage], // Declarar el componente a probar
      providers: [
        DatabaseService, // Servicio que utiliza SQLite
        { provide: SQLite, useClass: SQLiteMock }, // Usar el mock de SQLite
        { provide: Storage, useClass: StorageMock }, // Usar el mock de Storage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage); // Crear instancia del componente
    component = fixture.componentInstance;
    fixture.detectChanges(); // Disparar detección de cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se crea correctamente
  });
});
