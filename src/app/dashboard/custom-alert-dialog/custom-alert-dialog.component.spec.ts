import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAlertDialogComponent } from './custom-alert-dialog.component';

describe('CustomAlertDialogComponent', () => {
  let component: CustomAlertDialogComponent;
  let fixture: ComponentFixture<CustomAlertDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomAlertDialogComponent]
    });
    fixture = TestBed.createComponent(CustomAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
