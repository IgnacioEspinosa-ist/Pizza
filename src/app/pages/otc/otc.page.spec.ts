import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtcPage } from './otc.page';

describe('OtcPage', () => {
  let component: OtcPage;
  let fixture: ComponentFixture<OtcPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
