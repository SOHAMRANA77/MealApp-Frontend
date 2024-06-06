import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutConfirmationDialogComponent } from './logout-confirmation-dialog.component';

describe('LogoutConfirmationDialogComponent', () => {
  let component: LogoutConfirmationDialogComponent;
  let fixture: ComponentFixture<LogoutConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutConfirmationDialogComponent]
    });
    fixture = TestBed.createComponent(LogoutConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
