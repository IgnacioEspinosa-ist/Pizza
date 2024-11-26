import { TestBed } from '@angular/core/testing';
import { MapaComponent } from './maparapi.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; 
import { ActivatedRoute } from '@angular/router';



class ActivatedRouteMock {
  snapshot = {
    paramMap: {
      get: () => 'mocked-param', 
    },
  };
}

describe('MapaComponent', () => {
  let component: MapaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapaComponent, 
        { provide: SQLite, useClass: SQLiteMock }, 
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }, 
      ]
    });

    // Crear el componente
    component = TestBed.inject(MapaComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy(); 
  });
});
