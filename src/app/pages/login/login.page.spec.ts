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
        { provide: SQLite, useClass: SQLiteMock }, 
        DatabaseService,
        { provide: Storage, useValue: { create: jasmine.createSpy(), set: jasmine.createSpy() } }, 
        { provide: NavController, useValue: { navigateForward: jasmine.createSpy() } }, 
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
      expect(username).toBe('test@example.com'); 
      return Promise.resolve({ id_user: 1, id_roll: 1 });
    });

    component.username = 'Test@Example.com'; 
    component.password = 'password123';

    await component.login(); 

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123'); 
  });

  it('cortar espacio en blancos', async () => {
    const spy = spyOn(dbService, 'validarUsuario').and.callFake((username: string, password: string) => {
     
      expect(username).toBe('test@example.com'); 
      return Promise.resolve({ id_user: 1, id_roll: 1 });
    });

   
    component.username = '   test@example.com   ';
    component.password = 'password123';

    await component.login(); 

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123'); 
  });
  it('debería mostrar error si los campos están vacíos', async () => {
    const spyAlert = spyOn(window, 'alert'); 
    const spyDbService = spyOn(dbService, 'validarUsuario'); 

  
    component.username = '';
    component.password = '';

    await component.login(); 

    expect(spyDbService).not.toHaveBeenCalled(); 
    expect(spyAlert).toHaveBeenCalledWith('Ingrese el Nombre y Contraseña Correcta');});

  it('debería mostrar error si la contraseña tiene menos de 8 caracteres', async () => {
    const spyAlert = spyOn(window, 'alert'); 
    const spyDbService = spyOn(dbService, 'validarUsuario'); 
  
    
    component.username = 'test@example.com';
    component.password = '12345'; 
  
    await component.login(); 
  
    expect(spyDbService).not.toHaveBeenCalled(); 
    expect(spyAlert).toHaveBeenCalledWith('La contraseña debe tener al menos 8 caracteres'); 
  });
  
});
