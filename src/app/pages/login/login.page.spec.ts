import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { DatabaseService } from '../../services/database.service';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let dbService: DatabaseService;
  let storage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: SQLite, useClass: SQLiteMock }, // Mock del servicio SQLite
        DatabaseService,
        { provide: Storage, useValue: { create: jasmine.createSpy(), set: jasmine.createSpy() } }, // Mock de Storage
        { provide: NavController, useValue: { navigateForward: jasmine.createSpy() } }, // Mock de NavController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    dbService = TestBed.inject(DatabaseService);
    storage = TestBed.inject(Storage);
    fixture.detectChanges();
  });

  it('poner el correo en minuscula', async () => {
    const spy = spyOn(dbService, 'validarUsuario').and.callFake((username: string, password: string) => {
      expect(username).toBe('test@example.com'); // Verifica que el username sea en minúsculas
      return Promise.resolve({ id_user: 1, id_roll: 1 });
    });

    component.username = 'Test@Example.com'; // Establecer un correo en mayúsculas
    component.password = 'password123';

    await component.login(); // Llamar al método login

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123'); // Verifica que el servicio sea llamado con el username en minúsculas
  });

  it('cortar espacio en blancos', async () => {
    const spy = spyOn(dbService, 'validarUsuario').and.callFake((username: string, password: string) => {
      // Verifica que el nombre de usuario no tenga espacios al principio ni al final
      expect(username).toBe('test@example.com'); // Nombre de usuario esperado sin espacios
      return Promise.resolve({ id_user: 1, id_roll: 1 });
    });

    // Agregar espacios en blanco al nombre de usuario
    component.username = '   test@example.com   ';
    component.password = 'password123';

    await component.login(); // Llamar al método login

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123'); // Verifica que el servicio sea llamado con el username sin espacios
  });
});
