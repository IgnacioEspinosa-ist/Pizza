import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistUPage } from './hist-u.page';

describe('HistUPage', () => {
  let component: HistUPage;
  let fixture: ComponentFixture<HistUPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistUPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
