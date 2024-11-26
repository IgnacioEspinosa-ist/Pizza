import { TestBed } from '@angular/core/testing';
import { MapaComponent } from './maparapi.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service'; // Asegúrate de tener este mock
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock de ActivatedRoute
class ActivatedRouteMock {
  snapshot = {
    paramMap: {
      get: () => 'mocked-param', // Retorna un valor simulado
    },
  };
}

describe('MapaComponent', () => {
  let component: MapaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapaComponent, // El componente que estamos probando
        { provide: SQLite, useClass: SQLiteMock }, // Proveer el mock de SQLite
        { provide: ActivatedRoute, useClass: ActivatedRouteMock }, // Proveer el mock de ActivatedRoute
      ]
    });

    // Crear el componente
    component = TestBed.inject(MapaComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado
  });
});
