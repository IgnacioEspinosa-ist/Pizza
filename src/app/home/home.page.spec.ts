import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page'; 
import { Storage } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 




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

class MockSQLite {
  async openDatabase() {
    return {
      executeSql: () => Promise.resolve(),
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
        { provide: Storage, useClass: MockStorage },
        { provide: SQLite, useClass: MockSQLite },   
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
