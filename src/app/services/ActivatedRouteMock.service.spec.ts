import { TestBed } from '@angular/core/testing';
import { ActivatedRouteMock } from './ActivatedRouteMock.service';


describe('ActivatedRouteMockService', () => {
  let service: ActivatedRouteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivatedRouteMock]
    });
    service = TestBed.inject(ActivatedRouteMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio se haya creado correctamente
  });
});
