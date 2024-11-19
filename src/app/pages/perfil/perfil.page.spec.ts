import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page'; // Asegúrate de que tu componente esté importado correctamente
import { DatabaseService } from 'src/app/services/database.service';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilPage], // Declarar el componente que estás probando
      providers: [
        { provide: SQLite, useClass: SQLiteMock }, // Proveer el mock de SQLite
        DatabaseService // Asegúrate de incluir el servicio de base de datos
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se cree correctamente
  });
});
