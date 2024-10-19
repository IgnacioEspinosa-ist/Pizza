import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaComponent } from './maparapi.page';

describe('MaparapiPage', () => {
  let component: MapaComponent;
  let fixture: ComponentFixture<MapaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
