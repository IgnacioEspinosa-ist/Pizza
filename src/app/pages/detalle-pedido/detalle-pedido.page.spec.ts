import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePedidoPage } from './detalle-pedido.page';
import { DatabaseService } from 'src/app/services/database.service';
import { SQLiteMock } from 'src/app/services/sqlite-mock.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('DetallePedidoPage', () => {
  let component: DetallePedidoPage;
  let fixture: ComponentFixture<DetallePedidoPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePedidoPage],
      providers: [
        { provide: SQLite, useClass: SQLiteMock }, // Proveer el mock de SQLite
        DatabaseService // Incluir el servicio
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verificar que el componente se haya creado correctamente
  });
});
