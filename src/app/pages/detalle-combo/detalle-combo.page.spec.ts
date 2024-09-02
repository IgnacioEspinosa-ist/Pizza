import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleComboPage } from './detalle-combo.page';

describe('DetalleComboPage', () => {
  let component: DetalleComboPage;
  let fixture: ComponentFixture<DetalleComboPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleComboPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
