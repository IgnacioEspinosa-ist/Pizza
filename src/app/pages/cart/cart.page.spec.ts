import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart.page';
import { CarritoService } from 'src/app/services/carrito.service';
import { Producto } from 'src/app/services/producto';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage-angular'; 


class MockStorage {
  async set({ key, value }: { key: string, value: string }) {
    return Promise.resolve(); 
  }

  async get({ key }: { key: string }) {
    return Promise.resolve({ value: 'mocked value' }); 
  }

  async remove({ key }: { key: string }) {
    return Promise.resolve(); 
  }
}

class MockDatabaseService {
  insertProduct() {
    return Promise.resolve(); 
  }
}

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let carritoServiceMock: jasmine.SpyObj<CarritoService>;

  beforeEach(async () => {
    const mockCarritoService = jasmine.createSpyObj('CarritoService', ['obtenerProductos']); 

    await TestBed.configureTestingModule({
      declarations: [CartPage],
      providers: [
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: DatabaseService, useClass: MockDatabaseService }, 
        { provide: Storage, useClass: MockStorage }, 
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
  

    component.productos = productosMock;
  
  
    component.calcularTotal();
  
   
    const totalEsperado = 26000;
  
   
    expect(component.totalCarrito).toEqual(totalEsperado);
  });
});
