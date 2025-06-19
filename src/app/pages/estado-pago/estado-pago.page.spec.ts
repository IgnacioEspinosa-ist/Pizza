import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoPagoPage } from './estado-pago.page';

describe('EstadoPagoPage', () => {
  let component: EstadoPagoPage;
  let fixture: ComponentFixture<EstadoPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
