import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { DatabaseService } from 'src/app/services/database.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular'; 


class MockSQLite {
  async create(options: any) {
    return {
      executeSql: (query: string, params: any[] = []) => Promise.resolve({ rows: [] }),
    };
  }
}

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPage], 
      imports: [
        IonicModule.forRoot(), 
        ReactiveFormsModule,   
        FormsModule            
      ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseService },
        { provide: SQLite, useClass: MockSQLite },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
