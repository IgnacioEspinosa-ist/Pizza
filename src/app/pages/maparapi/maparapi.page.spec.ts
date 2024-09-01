import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaparapiPage } from './maparapi.page';

describe('MaparapiPage', () => {
  let component: MaparapiPage;
  let fixture: ComponentFixture<MaparapiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaparapiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
