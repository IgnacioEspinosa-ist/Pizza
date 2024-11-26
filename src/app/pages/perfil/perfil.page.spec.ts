import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page'; 
import { DatabaseService } from 'src/app/services/database.service'; 
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { Storage } from '@ionic/storage-angular'; 
import { StorageMock } from 'src/app/services/storage-mock.service'; 

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilPage], 
      providers: [
        DatabaseService, 
        { provide: SQLite, useClass: SQLiteMock }, 
        { provide: Storage, useClass: StorageMock }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage); 
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});
