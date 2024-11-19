import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page'; // O la página que corresponda
import { Storage } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Asegúrate de importar SQLite desde el paquete correcto



// Mock de Storage
class MockStorage {
  async get() {
    return { value: null };
  }

  async set() {
    return Promise.resolve();
  }

  async remove() {
    return Promise.resolve();
  }
}

// Mock de SQLite
class MockSQLite {
  async openDatabase() {
    return {
      executeSql: () => Promise.resolve(), // Simula que ejecuta SQL sin hacer nada
      close: () => Promise.resolve(),
    };
  }
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: Storage, useClass: MockStorage }, // Proveemos el mock de Storage
        { provide: SQLite, useClass: MockSQLite },   // Proveemos el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
