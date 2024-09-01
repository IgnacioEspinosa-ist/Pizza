import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapacliPage } from './mapacli.page';

describe('MapacliPage', () => {
  let component: MapacliPage;
  let fixture: ComponentFixture<MapacliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapacliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
