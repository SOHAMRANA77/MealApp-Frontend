import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsNDcondiComponent } from './terms-ndcondi.component';

describe('TermsNDcondiComponent', () => {
  let component: TermsNDcondiComponent;
  let fixture: ComponentFixture<TermsNDcondiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsNDcondiComponent]
    });
    fixture = TestBed.createComponent(TermsNDcondiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
