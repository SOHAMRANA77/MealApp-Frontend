import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUSComponent } from './about-us.component';

describe('AboutUSComponent', () => {
  let component: AboutUSComponent;
  let fixture: ComponentFixture<AboutUSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUSComponent]
    });
    fixture = TestBed.createComponent(AboutUSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
