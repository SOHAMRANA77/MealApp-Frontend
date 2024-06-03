import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRcodeComponent } from './qrcode.component';

describe('QRcodeComponent', () => {
  let component: QRcodeComponent;
  let fixture: ComponentFixture<QRcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QRcodeComponent]
    });
    fixture = TestBed.createComponent(QRcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
