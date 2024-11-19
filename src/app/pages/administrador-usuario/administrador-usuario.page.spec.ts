import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosPage } from './administrador-usuario.page';
import { DatabaseService } from 'src/app/services/database.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Asegúrate de importar los módulos de formularios

// Mock SQLite
class MockSQLite {
  async create(options: any) {
    return {
      executeSql: (query: string, params: any[] = []) => Promise.resolve({ rows: [] }),
    };
  }
}

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosPage], // Asegúrate de declarar el componente
      imports: [
        IonicModule.forRoot(),    // Asegúrate de incluir IonicModule
        ReactiveFormsModule,      // Para formularios reactivos
        FormsModule               // Para ngModel
      ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseService },
        { provide: SQLite, useClass: MockSQLite }, // Proveedor mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
