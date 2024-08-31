import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomerepaPage } from './homerepa.page';

describe('HomerepaPage', () => {
  let component: HomerepaPage;
  let fixture: ComponentFixture<HomerepaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomerepaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
