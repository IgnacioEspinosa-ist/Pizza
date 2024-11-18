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
  it('debería mostrar error si los campos están vacíos', async () => {
    const spyAlert = spyOn(window, 'alert'); // Espiar la función alert
    const spyDbService = spyOn(dbService, 'validarUsuario'); // Espiar el servicio validarUsuario

    // Dejar los campos vacíos
    component.username = '';
    component.password = '';

    await component.login(); // Llamar al método login

    expect(spyDbService).not.toHaveBeenCalled(); // El servicio no debe ser llamado
    expect(spyAlert).toHaveBeenCalledWith('Ingrese el Nombre y Contraseña Correcta');});

  it('debería mostrar error si la contraseña tiene menos de 8 caracteres', async () => {
    const spyAlert = spyOn(window, 'alert'); // Espiar la función alert
    const spyDbService = spyOn(dbService, 'validarUsuario'); // Espiar el servicio validarUsuario
  
    // Configurar username válido y contraseña corta
    component.username = 'test@example.com';
    component.password = '12345'; // Contraseña menor a 8 caracteres
  
    await component.login(); // Llamar al método login
  
    expect(spyDbService).not.toHaveBeenCalled(); // El servicio no debe ser llamado
    expect(spyAlert).toHaveBeenCalledWith('La contraseña debe tener al menos 8 caracteres'); // Verifica el mensaje de error
  });
  
});
