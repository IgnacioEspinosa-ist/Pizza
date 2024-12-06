import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistRPage } from './hist-r.page';

describe('HistRPage', () => {
  let component: HistRPage;
  let fixture: ComponentFixture<HistRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
