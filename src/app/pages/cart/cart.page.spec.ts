import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart.page';
import { CarritoService } from 'src/app/services/carrito.service';
import { Producto } from 'src/app/services/producto';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage-angular'; // Asegúrate de importar desde ionic storage angular

// Mock de Storage
class MockStorage {
  async set({ key, value }: { key: string, value: string }) {
    return Promise.resolve(); // Mock de la función set
  }

  async get({ key }: { key: string }) {
    return Promise.resolve({ value: 'mocked value' }); // Devuelve un valor mockeado
  }

  async remove({ key }: { key: string }) {
    return Promise.resolve(); // Mock de la función remove
  }
}

class MockDatabaseService {
  insertProduct() {
    return Promise.resolve(); // Mock de los métodos de DatabaseService
  }
}

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let carritoServiceMock: jasmine.SpyObj<CarritoService>;

  beforeEach(async () => {
    const mockCarritoService = jasmine.createSpyObj('CarritoService', ['obtenerProductos']); // Mock del servicio

    await TestBed.configureTestingModule({
      declarations: [CartPage],
      providers: [
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: DatabaseService, useClass: MockDatabaseService }, // Mock de DatabaseService
        { provide: Storage, useClass: MockStorage }, // Mock de Storage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    carritoServiceMock = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('suma de productos carrito', () => {
    // Datos mock para el carrito
    const productosMock: Producto[] = [
      { 
        id_prod: 1, 
        nombre: 'Pizza Margherita', 
        descripcion: 'Clásica pizza italiana con albahaca', 
        precio: 8000, 
        stock: 10, 
        cantidad: 2 
      },
      { 
        id_prod: 2, 
        nombre: 'Pizza Pepperoni', 
        descripcion: 'Pizza con pepperoni y queso mozzarella', 
        precio: 10000, 
        stock: 5, 
        cantidad: 1 
      },
    ];
  
    // Asigna los productos mock al componente
    component.productos = productosMock;
  
    // Ejecuta la función para calcular el total
    component.calcularTotal();
  
    // Total esperado: (8000 * 2) + (10000 * 1) = 26000
    const totalEsperado = 26000;
  
    // Comprueba que el total calculado sea correcto
    expect(component.totalCarrito).toEqual(totalEsperado);
  });
});
