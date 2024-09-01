import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilRPage } from './perfil-r.page';

describe('PerfilRPage', () => {
  let component: PerfilRPage;
  let fixture: ComponentFixture<PerfilRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
