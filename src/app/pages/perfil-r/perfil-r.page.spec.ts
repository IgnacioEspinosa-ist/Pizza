import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilRPage } from './perfil-r.page';
import { DatabaseService } from 'src/app/services/database.service'; // Si necesitas DatabaseService o dependencias similares
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; // Mock de SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite de la librería real
// Mock de Storage
import { Storage } from '@ionic/storage-angular'; // Importa Storage
import { StorageMock } from 'src/app/services/storage-mock.service';

describe('PerfilRPage', () => {
  let component: PerfilRPage;
  let fixture: ComponentFixture<PerfilRPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilRPage], // Declara el componente
      providers: [
        DatabaseService, // Servicio que usa SQLite
        { provide: SQLite, useClass: SQLiteMock }, // Usamos el mock de SQLite
        { provide: Storage, useClass: StorageMock }, // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado correctamente
  });
});
