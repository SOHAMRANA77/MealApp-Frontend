import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPdialogComponent } from './otpdialog.component';

describe('OTPdialogComponent', () => {
  let component: OTPdialogComponent;
  let fixture: ComponentFixture<OTPdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OTPdialogComponent]
    });
    fixture = TestBed.createComponent(OTPdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
