import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarContrasenaPage } from './cambiar-contrasena.page'; 
import { DatabaseService } from 'src/app/services/database.service'; 
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { Storage } from '@ionic/storage-angular'; 
import { StorageMock } from 'src/app/services/storage-mock.service'; 

describe('CambiarContrasenaPage', () => {
  let component: CambiarContrasenaPage;
  let fixture: ComponentFixture<CambiarContrasenaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaPage], 
      providers: [
        DatabaseService, 
        { provide: SQLite, useClass: SQLiteMock }, 
        { provide: Storage, useClass: StorageMock }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenaPage); 
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});
