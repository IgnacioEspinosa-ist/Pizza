import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosPage } from './administrador-usuario.page';

describe('AdministradorUsuarioPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
